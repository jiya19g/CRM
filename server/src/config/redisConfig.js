const redis = require('redis');
require('dotenv').config(); // To load environment variables

// Create and configure Redis client for Pub/Sub
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Handle Redis connection
client.connect().catch(err => console.log('Error connecting to Redis:', err));

client.on('connect', () => {
  console.log('Connected to Redis...');
});

client.on('error', (err) => {
  console.log('Redis error:', err);
});

module.exports = client;
