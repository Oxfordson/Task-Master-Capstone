const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const path = require('path');
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback route for the frontend (catch-all route for SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', '404.html'));
});

// Fallback for undefined routes (404 handler)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend', '404.html'));
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

