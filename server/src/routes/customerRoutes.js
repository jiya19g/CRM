// server/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { addCustomer } = require('../controllers/customerController');


// POST /api/customers/add
router.post('/add', addCustomer);

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer', error: err });
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer', error: err });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer', error: err });
  }
});

module.exports = router;
