// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const connectDB = require('./config/db'); // Centralized DB connection logic

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

const port = process.env.PORT || 4000;

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
console.log('Registering adminRoutes');
app.use('/api/admin', adminRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Request Case routes
const requestCaseRoutes = require('./routes/requestCaseRoutes');
app.use('/api/request-case', requestCaseRoutes);

// Case routes
const caseRoutes = require('./routes/caseRoutes'); 
console.log('Registering caseRoutes');
app.use('/api/cases', caseRoutes);

// File routes
const fileRoutes = require('./routes/fileRoutes');
console.log('Registering fileRoutes');
app.use('/api/files', fileRoutes);

// Test database connection when the server starts
(async () => {
  try {
    await connectDB();
    console.log('Database connection successful');
  } catch (err) {
    console.error('Failed to connect to OracleDB:', err);
  }
})();

// Endpoint to check if server is working
app.get('/', (req, res) => {
  res.send('Legal Cases App Backend is running');
});

// Example route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const connection = await connectDB();
    res.send('Database connected successfully!');
    await connection.close();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Error connecting to the database');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
