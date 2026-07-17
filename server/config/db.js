const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 2712,
};

const dbName = process.env.DB_NAME || 'country_state_db';

let pool;

// This function creates the database if it doesn't exist and then instantiates the connection pool
async function initDB() {
  try {
    // 1. Connect without specifying the database to ensure we can create it
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConnection.end();
    console.log(`Database "${dbName}" checked/created successfully.`);

    // 2. Initialize the main connection pool pointing to the database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const testConn = await pool.getConnection();
    console.log('MySQL Connection Pool established.');
    testConn.release();

    return pool;
  } catch (error) {
    console.error('Failed to initialize MySQL database connection:', error);
    throw error;
  }
}

// Export a proxy or function to get the active pool
module.exports = {
  initDB,
  get pool() {
    if (!pool) {
      throw new Error('Database pool not initialized. Call initDB() first.');
    }
    return pool;
  }
};
