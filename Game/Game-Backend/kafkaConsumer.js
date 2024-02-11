const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'Game',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'gameConsumer' });
const messages = {};

let updateFrontendCallback; 
const init = async (updateCallback) => {
  updateFrontendCallback = updateCallback; 

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
      messages[topic].push(JSON.parse(messageValue));
      updateFrontendCallback(addTypeToMessage(topic, JSON.parse(messageValue)));
      console.log(topic, messageValue);
      if (messageValue.status === "ended") {
        messages[topic] = [];
        messages['roundStatus'] = [];
        console.log(`All messages for topic "${topic}" have been deleted.`);
      }
    },
  });
};
function addTypeToMessage(topic, message) {
  return {
    type: topic,
    message: {...message}
  };
}

module.exports = {
  init,
  getMessages: (topic) => messages[topic] || []
};
