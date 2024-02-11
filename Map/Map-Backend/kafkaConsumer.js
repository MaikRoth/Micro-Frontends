const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'Map',
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'mapConsumer' });
const messages = {};
const map = {
  grid: [],
  planetsMap: {}
};

let updateFrontendCallback; 
const init = async (updateCallback) => {
  updateFrontendCallback = updateCallback; 

  await consumer.connect();
  const topics = ['gameworld', 'planet', 'status'];

  for (let topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    messages[topic] = [];
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsedMessage = JSON.parse(message.value.toString());
      messages[topic].push(parsedMessage);
      if (topic === 'status' && parsedMessage.status === 'ended') {
        topics.forEach(topic => messages[topic] = []);
        map.grid = [];
        map.planetsMap = {};
      } else if (topic === 'gameworld' && parsedMessage.planets) {
        createMapFromMessage(parsedMessage);
        updateFrontendCallback(map.grid);
      } else if (topic === 'planet') {
        updatePlanetResource(parsedMessage);
      }
    },
  });
};

function createMapFromMessage(message) {
  let planets = message.planets;
  let maxX = 0;
  let maxY = 0;
  planets.forEach(planet => {
    if (planet.x > maxX) maxX = planet.x;
    if (planet.y > maxY) maxY = planet.y;
    map.planetsMap[planet.id] = planet;
  });

  const mapSize = Math.max(maxX, maxY) + 1;
  map.grid = Array.from({ length: mapSize }, () =>
    Array.from({ length: mapSize }, () => null)
  );

  Object.values(map.planetsMap).forEach(planet => {
    map.grid[planet.y][planet.x] = planet;
  });

}
function updatePlanetResource({ planet: planetId, minedAmount, resource }) {
  let planet = map.planetsMap[planetId];
  if (resource) {
    const currentAmount = resource.currentAmount;
    if (planet) {
      map.grid[planet.y][planet.x].resource.currentAmount = currentAmount;
      updateFrontendCallback(map.grid);
    }
  }
}

module.exports = {
  init,
  getMessages: (topic) => messages[topic] || [],
  getMap: () => map.grid || [],
  getPlanetById: (id) => map.planetsMap[id] || null
};
