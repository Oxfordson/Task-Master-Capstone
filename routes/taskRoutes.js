const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
// const Task = require('./models/taskModel');

// Define routes for tasks
router.get('/', taskController.getAllTasks); // Get all tasks
router.post('/', taskController.addTask);    // Add a new task
router.delete('/:id', taskController.deleteTask); // Delete a task by ID
router.patch('/:id', taskController.updateTask); //update a task(e.g., mark as completed)
router.delete('/:id', taskController.deleteTask); //delete a task



module.exports = router;
