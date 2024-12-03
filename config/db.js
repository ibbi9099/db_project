const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
};

async function connectDB() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to OracleDB');
    return connection;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

module.exports = connectDB;
