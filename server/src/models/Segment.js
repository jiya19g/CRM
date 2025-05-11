const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const segmentSchema = new Schema({
  name: { type: String, required: true },
  rules: [
    {
      ruleType: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
    }
  ],
  operator: { type: String, enum: ['and', 'or'], required: true },
  customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }], // Changed from filteredCustomers to customers
}, { timestamps: true });

const Segment = mongoose.model('Segment', segmentSchema);

module.exports = Segment;
