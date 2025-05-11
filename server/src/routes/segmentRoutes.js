const express = require('express');
const router = express.Router();
const Segment = require('../models/Segment');
const { filterCustomers } = require('../controllers/customerController');

// GET /api/segments
router.get('/', async (req, res) => {
  try {
    const segments = await Segment.find().populate('customers');
    res.json(segments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Add this to your segments route
router.post('/filter', async (req, res) => {
  try {
    const filteredCustomers = await filterCustomers(req);
    res.json(filteredCustomers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/segments
// POST /api/segments
// POST /api/segments
// POST /api/segments
// POST /api/segments
router.post('/', async (req, res) => {
  const { name, rules, operator } = req.body;

  // Check if operator is provided
  if (!operator) {
    return res.status(400).json({ error: 'Operator is required' });
  }

  try {
    // Step 1: Filter customers based on rules and operator
    const filteredCustomers = await filterCustomers(req); // Directly pass req to filterCustomers

    // Ensure filteredCustomers is an array before proceeding
    if (!Array.isArray(filteredCustomers)) {
      return res.status(500).json({ message: 'Failed to filter customers properly' });
    }

    // Step 2: Create a new Segment with the filtered customers
    const newSegment = new Segment({
      name,
      rules,
      operator,
      customers: filteredCustomers.map(c => c._id) // Save only customer IDs in the segment
    });

    await newSegment.save();

    return res.status(201).json(newSegment); // Return the response only once
  } catch (err) {
    console.error('Error saving segment:', err.message); // Log error message
    return res.status(500).json({ message: 'Error saving the segment. Please try again.' });
  }
});



module.exports = router;
