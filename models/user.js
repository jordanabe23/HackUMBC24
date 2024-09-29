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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  conversations: [ConversationSchema]
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
