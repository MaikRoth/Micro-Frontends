const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'Map',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'kafkaConsumers' });
const messages = {};

const run = async () => {
  await consumer.connect();

  const topics = [
    'GameStatus', 'RoundStatus', 'Status','gameworld', 'planet', 'status'
  ];

  for (let topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false});
    messages[topic] = [];
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      messages[topic].push(message.value.toString());
      console.log(topic,messages[topic]);
    },
  });
};

run().catch(console.error);

module.exports = {
  getMessages: (topic) => messages[topic] || []
};
