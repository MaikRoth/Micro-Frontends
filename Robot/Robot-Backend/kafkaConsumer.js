const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'Robot',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'robotConsumer' });
const messages = {};

const run = async () => {
  await consumer.connect();

  const topics = [
    'bank', 'robot', 'command',
  ];

  for (let topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    messages[topic] = [];
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = message.value.toString();
      messages[topic].push(JSON.parse(messageValue));
      console.log(topic, messageValue);
    },
  });
};

run().catch(console.error);

module.exports = {
  getMessages: (topic) => messages[topic] || []
};
