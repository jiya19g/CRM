const client = require('../config/redisConfig');

const consumeMessage = async () => {
  try {
    await client.subscribe('customerChannel', (message) => {
      const customer = JSON.parse(message);
      console.log('Received customer from Redis:', customer);
      // You can also write to MongoDB, log, etc.
    });
  } catch (err) {
    console.log('Error subscribing to Redis channel:', err);
  }
};

consumeMessage();
