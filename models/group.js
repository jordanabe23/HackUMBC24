import mongoose from 'mongoose';

const { Schema } = mongoose;

const groupSchema = new Schema({
  groupName: { type: String, required: true }, // Ensure 'required' is spelled correctly
  todos: [{ type: Schema.Types.ObjectId, todos: [] }], // No need for 'required: true' in arrays of references
});

// Prevent OverwriteModelError by checking if the model already exists
const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
