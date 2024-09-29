import mongoose from 'mongoose';

const { Schema } = mongoose;

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  todos: [{ type: Schema.Types.ObjectId, ref: 'Todo', required: true }], // References to Todo
});

// Prevent OverwriteModelError by checking if the model already exists
const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
