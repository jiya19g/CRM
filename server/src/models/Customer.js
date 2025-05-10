// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },

  totalSpend: { type: Number, default: 0 },       
  visits: { type: Number, default: 0 },           
  lastVisit: { type: Date },                     
  location: { type: String },                     
  customerType: { type: String, enum: ['new', 'regular', 'vip'], default: 'new' }, 
  age: { type: Number },                          
  gender: { type: String, enum: ['male', 'female', 'other'] }, 
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
