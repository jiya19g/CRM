const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
});

const campaignSchema = new Schema({
  segmentId: { type: Schema.Types.ObjectId, ref: 'Segment', required: true },
  segmentName: { type: String },
  message: { type: String, required: true },
  deliveries: [deliverySchema],
  sent: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  audienceSize: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);