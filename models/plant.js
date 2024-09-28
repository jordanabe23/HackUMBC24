const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  name: { type: String, required: true }, // Name of the plant
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true }, // Reference to the Group
  wateringFrequency: { type: Number, required: true }, // Days between watering
  waterAmount: { type: String, required: true }, // Amount of water required
  maturityTime: { type: Number, required: true }, // Days to maturity
  matureSize: { type: String }, // Size or height at maturity
  growthStages: [{ stage: String, description: String }] // Optional: Array of growth stages
});

module.exports = mongoose.model('Plant', plantSchema);
