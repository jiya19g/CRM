const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const axios = require('axios');

// GET /api/campaigns - List all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
});

// POST /api/campaigns - Create a campaign and trigger delivery
router.post('/', async (req, res) => {
  const { segmentId, message } = req.body;
  if (!segmentId || !message) return res.status(400).json({ error: 'segmentId and message required' });

  try {
    const segment = await Segment.findById(segmentId).populate('customers');
    if (!segment) return res.status(404).json({ error: 'Segment not found' });

    // Create campaign log
    const deliveries = segment.customers.map(c => ({ customer: c._id, status: 'PENDING' }));
    const campaign = await Campaign.create({
      segmentId,
      segmentName: segment.name,
      message,
      deliveries,
      audienceSize: deliveries.length,
    });

    // Simulate sending messages via dummy vendor API
    for (const c of segment.customers) {
      // Simulate async delivery (in real world, use queue/worker)
      axios.post('http://localhost:5000/api/vendor/send', {
        campaignId: campaign._id,
        customerId: c._id,
        message: message.replace('{name}', c.name),
      }).catch(() => {});
    }

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Error creating campaign' });
  }
});

module.exports = router;