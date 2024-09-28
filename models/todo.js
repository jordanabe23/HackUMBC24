const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional: References to User
  plantId: { type: Schema.Types.ObjectId, ref: 'Plant' }, // Optional: References to Plant
  dueDate: { type: Date }
});

module.exports = mongoose.model('Todo', todoSchema);
