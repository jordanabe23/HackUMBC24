const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References to User
  todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }], // References to Todo
  plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }] // References to Plant
});

module.exports = mongoose.model('Group', groupSchema);
