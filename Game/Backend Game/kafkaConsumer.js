const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'Game',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'GameConsumer' });
const messages = {};

const run = async () => {
  await consumer.connect();

  const topics = [
    'roundStatus', 'status'
  ];

  for (let topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false});
    messages[topic] = [];
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = message.value.toString();
      messages[topic].push(messageValue);
      console.log(topic, messageValue);

      const parsedMessage = JSON.parse(messageValue);
      if (parsedMessage.status === "ended") {
        messages[topic] = [];
        messages['roundStatus'] = [];
        console.log(`All messages for topic "${topic}" have been deleted.`);
      }
    },
  });
};

run().catch(console.error);

module.exports = {
  getMessages: (topic) => messages[topic] || []
};
