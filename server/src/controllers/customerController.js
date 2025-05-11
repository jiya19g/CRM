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

const filterCustomers = async (req) => {
  const { rules, operator } = req.body;

  if (!rules || rules.length === 0) {
    throw new Error('No rules provided');
  }

  if (rules.length > 1 && !operator) {
    throw new Error('Operator is required when using multiple rules');
  }

  const currentOperator = operator || 'and'; // Default to 'and' if operator is not provided

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

    const query = currentOperator === 'or' ? { $or: ruleQueries } : { $and: ruleQueries };
    const filteredCustomers = await Customer.find(query);

    if (!filteredCustomers || filteredCustomers.length === 0) {
      throw new Error('No customers found matching the criteria');
    }

    return filteredCustomers; // Return the filtered customers directly
  } catch (err) {
    console.error(err);
    throw new Error('Error filtering customers');
  }
};




module.exports = { addCustomer, filterCustomers };
