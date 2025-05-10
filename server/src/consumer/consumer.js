const client = require('../config/redisConfig');

// Subscribe to the 'customerQueue' channel
const consumeMessage = async () => {
  try {
    await client.subscribe('customerChannel', (message) => {
      console.log('Received message from channel:', message);
    });
  } catch (err) {
    console.log('Error subscribing to Redis channel:', err);
  }
};

consumeMessage();
