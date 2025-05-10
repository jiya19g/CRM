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

const addCustomer = async (req, res) => {
  const { error } = customerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();

    //Publish to Redis after saving
    await client.publish('customerChannel', JSON.stringify(newCustomer));
    console.log('Published to Redis:', newCustomer);

    res.status(201).json({ message: 'Customer added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { addCustomer };
