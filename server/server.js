require('dotenv').config();
const cors = require("cors");
const express = require('express');
const connectDB = require('./src/config/db'); // ⬅️ updated path
const axios = require('axios');
const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Log Mongo URI for debugging purposes
console.log("Mongo URI:", process.env.MONGO_URI);

// Route for customers
const customerRoutes = require('./src/routes/customerRoutes'); // ⬅️ updated path
app.use('/api/customers', customerRoutes);

// Route for segments
const segmentRoutes = require('./src/routes/segmentRoutes'); // ⬅️ updated path
app.use('/api/segments', segmentRoutes);

const campaignRoutes = require('./src/routes/campaignRoutes');
app.use('/api/campaigns', campaignRoutes);

const aiRoutes = require('./src/routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



const Campaign = require('./src/models/Campaign');

// Dummy vendor API: simulates delivery and calls delivery receipt
app.post('/api/vendor/send', async (req, res) => {
  const { campaignId, customerId, message } = req.body;
  // Simulate 90% SENT, 10% FAILED
  const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
  setTimeout(() => {
    axios.post('http://localhost:5000/api/delivery-receipt', {
      campaignId,
      customerId,
      status,
    }).catch(() => {});
  }, 500 + Math.random() * 1000);
  res.json({ status });
});

// Delivery receipt API: updates campaign delivery status
app.post('/api/delivery-receipt', async (req, res) => {
  const { campaignId, customerId, status } = req.body;
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const delivery = campaign.deliveries.find(d => d.customer.toString() === customerId);
    if (delivery) {
      delivery.status = status;
      if (status === 'SENT') campaign.sent += 1;
      if (status === 'FAILED') campaign.failed += 1;
      await campaign.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error updating delivery status' });
  }
});