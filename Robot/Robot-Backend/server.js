const express = require('express');
const bodyParser = require('body-parser');
const kafkaConsumer = require('./kafkaConsumer');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/topics/:topicName', (req, res) => {
  const topicName = req.params.topicName;
  const messages = kafkaConsumer.getMessages(topicName);
  res.json(messages);
});

const PORT = 4004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
