// src/models/user.js
import mongoose from 'mongoose';

// Define the schema for the user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add other fields as necessary
});

// Create a model from the schema
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
