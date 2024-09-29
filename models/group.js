import mongoose from 'mongoose';

const { Schema } = mongoose;

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References to User
  todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }], // References to Todo
  plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }] // References to Plant
});

// Prevent OverwriteModelError by checking if the model already exists
const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
