import mongoose from 'mongoose';

const { Schema } = mongoose;

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
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }], requrired: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
