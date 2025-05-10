const Joi = require('joi');
const Customer = require('../models/Customer');
const client = require('../config/redisConfig');

const customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  totalSpend: Joi.number().min(0).required(),
  visits: Joi.number().min(0).required(),
  lastVisit: Joi.date().required(),
  location: Joi.string().required(),
  customerType: Joi.string().valid('vip', 'regular', 'new').required(),
  age: Joi.number().min(18).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
});

// ✅ Add a customer and publish to Redis
const addCustomer = async (req, res) => {
  const { error } = customerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();

    await client.publish('customerChannel', JSON.stringify(newCustomer));
    console.log('Published to Redis:', newCustomer);

    res.status(201).json({ message: 'Customer added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Filter customers based on rules
const filterCustomers = async (req, res) => {
  const { rules } = req.body;
  if (!rules || rules.length === 0) return res.status(400).json({ error: 'No rules provided' });

  try {
    let query = {};

    rules.forEach(rule => {
      switch (rule.ruleType) {
        case 'spendLessThan':
          query.totalSpend = { $lt: rule.value };
          break;
        case 'visitsLessThan':
          query.visits = { $lt: rule.value };
          break;
        case 'visitsGreaterThan':
          query.visits = { $gt: rule.value };
          break;
        case 'lastVisitBefore':
          query.lastVisit = { $lt: new Date(rule.value) };
          break;
        case 'ageGreaterThan':
          query.age = { $gt: rule.value };
          break;
        case 'ageLessThan':
          query.age = { $lt: rule.value };
          break;
        case 'customerType':
          query.customerType = rule.value;
          break;
        case 'gender':
          query.gender = rule.value;
          break;
        default:
          break;
      }
    });

    const filteredCustomers = await Customer.find(query);
    res.status(200).json(filteredCustomers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error filtering customers', message: err.message });
  }
};

module.exports = { addCustomer, filterCustomers };
