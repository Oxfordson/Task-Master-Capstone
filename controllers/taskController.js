const Task = require('../Models/taskModel.js'); // Assuming you have a Task model

// Fetch all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Add a new task
// exports.addTask = async (req, res) => {
//   const { title, completed } = req.body;
//   const newTask = new Task({ title, completed });

//   try {
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add task' });
//   }
// };

exports.addTask = async (req, res) => {
  try {
  const { title, description, dueDate } = req.body;

  // Create a new task
  const newTask = new Task({
    title,
    description,
    dueDate: Date(dueDate), // Make sure this is a Date object
  });
  

  // Save the task to the database
  await newTask.save();

  // Respond with the created task
  res.status(201).json(newTask);
  } catch (error) {
    // Send an error response if validation fails
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Take 
exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};


// Delete a task by ID
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};