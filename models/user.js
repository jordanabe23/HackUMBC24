import mongoose from 'mongoose';

const { Schema } = mongoose;

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
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true // Corrected typo here
  }],
});

// Prevent OverwriteModelError by checking if the model already exists
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
