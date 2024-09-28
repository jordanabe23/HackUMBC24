// models/Todo.js
import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  description: String,
  recurrence: { type: String, enum: ['once', 'daily', 'weekly', 'monthly'], default: 'once' },
  date: Date,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);