const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  name: { type: String, required: true },
  species: { type: String },
  lastWatered: { type: Date, required: true },
  wateringFrequency: { type: Number, required: true }, // in days
  waterAmount: { type: Number }, // in ml
  growthStages: {
    timeToMature: { type: Number }, // in days
    sizeForMature: { type: Number }, // in inches
    stages: [{ type: String }] // list of growth stages
  }
});

module.exports = mongoose.model('Plant', plantSchema);
