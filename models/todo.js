import mongoose from 'mongoose';
import internal from 'stream';

const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },  // Fixed description type
  recurrence: { type: internal, required: true },
  created: { type: Date, default: Date.now },     // Timestamp when todo is created
  completed: { type: Boolean, default: false },
  last_check: { type: Date }  // Tracks when the completed field was last updated
},
  {
    timestamps: { createdAt: 'created', updatedAt: false } // Only create 'created', no 'updatedAt'
  });

// Middleware to update 'last_check' whenever 'completed' is modified
TodoSchema.pre('save', function (next) {
  if (this.isModified('completed')) {
    this.last_check = Date.now();
  }
  next();
});

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
