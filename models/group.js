const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }]
});

module.exports = mongoose.model('Group', groupSchema);
