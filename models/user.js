// src/models/user.js
import mongoose from 'mongoose';

const { Schema } = mongoose; // Ensure you import Schema from mongoose

// Define the schema for the user
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { // Add email field from the incoming changes
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }] // Add groups field from the incoming changes
});

// Create a model from the schema
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
