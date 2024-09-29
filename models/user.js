import mongoose from 'mongoose';

const { Schema } = mongoose;

const ConversationSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
  },
  password: {
    type: String,
    required: true, // Ensures password is required
  },
  conversations: [ConversationSchema],  // Comma added here
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',  // Removed 'required: true' for array of references
  }],
});

// Prevent OverwriteModelError by checking if the model already exists
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
