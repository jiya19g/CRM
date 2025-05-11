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
  const { rules, operator } = req.body;
  if (!rules || rules.length === 0) return res.status(400).json({ error: 'No rules provided' });

  try {
    const ruleQueries = rules.map(rule => {
      switch (rule.ruleType) {
        case 'spendLessThan':
          return { totalSpend: { $lt: rule.value } };
        case 'visitsLessThan':
          return { visits: { $lt: rule.value } };
        case 'visitsGreaterThan':
          return { visits: { $gt: rule.value } };
        case 'lastVisitBefore':
          return { lastVisit: { $lt: new Date(rule.value) } };
        case 'ageGreaterThan':
          return { age: { $gt: rule.value } };
        case 'ageLessThan':
          return { age: { $lt: rule.value } };
        case 'customerType':
          return { customerType: rule.value };
        case 'gender':
          return { gender: rule.value };
        default:
          return {};
      }
    });

    const query = operator === 'or' ? { $or: ruleQueries } : { $and: ruleQueries };

    const filteredCustomers = await Customer.find(query);
    res.status(200).json(filteredCustomers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error filtering customers', message: err.message });
  }
};


module.exports = { addCustomer, filterCustomers };
