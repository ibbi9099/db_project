// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const connectDB = require('./config/db'); // Import the centralized DB connection
const oracledb = require('oracledb');

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

const port = process.env.PORT || 4001;

//Admin
const adminRoutes = require('./routes/adminRoutes');
console.log('Registering adminRoutes');
app.use('/api/admin', adminRoutes);


//Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

//request case
const requestCaseRoutes = require('./routes/requestCaseRoutes');
app.use('/api/request-case', requestCaseRoutes);


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
    const connection = await connectDB(); // Use centralized DB connection
    res.send('Database connected successfully!');
    await connection.close();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Error connecting to the database');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
