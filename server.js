const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Import dotenv to load environment variables
const path = require('path');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db.js'); // Import your custom DB connection logic
const authRoutes = require('./routes/authRoutes.js'); // Import auth routes
const taskRoutes = require('./routes/taskRoutes.js'); // Import task routes

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Fallback for undefined routes (404 handler)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend', '404.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
