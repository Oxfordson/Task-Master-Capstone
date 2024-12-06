const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],  // Title is required
    trim: true,  // Optional: trims any leading/trailing spaces
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],  // Description is required
    trim: true,  // Optional: trims any leading/trailing spaces
  },
  dueDate: {
    type: Date,
    required: [true, 'Task due date is required'],  // Due date is required
  },
  completed: {
    type: Boolean,
    default: false,  // By default, task is not completed
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
});

// Create and export the Task model based on the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
