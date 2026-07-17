const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const Country = require('./models/Country');
const countriesRouter = require('./routes/countries');
const statesRouter = require('./routes/states');
const citiesRouter = require('./routes/cities');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/countries', countriesRouter);
app.use('/api/states', statesRouter);
app.use('/api/cities', citiesRouter);

// Initialize MySQL database and tables
async function startServer() {
  try {
    // 1. Initialize DB and create connection pool
    await db.initDB();

    // 2. Create tables sequentially if they do not exist
    console.log('Ensuring tables are initialized...');
    
    await db.pool.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        capital VARCHAR(255),
        currency VARCHAR(255),
        population VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.pool.query(`
      CREATE TABLE IF NOT EXISTS states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country_id INT NOT NULL,
        capital VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
      )
    `);

    // Ensure capital column exists if table was created previously
    try {
      await db.pool.query(`ALTER TABLE states ADD COLUMN capital VARCHAR(255)`);
      console.log('Added capital column to states table.');
    } catch (err) {
      if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding capital column to states:', err);
      }
    }

    await db.pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state_id INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Tables initialized successfully.');

    // 3. Auto-seed default countries if database is empty
    const countryCount = await Country.countDocuments();
    if (countryCount === 0) {
      console.log('No countries found in MySQL. Seeding initial records...');
      const seedCountries = [
        { name: 'India', capital: 'New Delhi', currency: 'INR', population: '1.4 Billion' },
        { name: 'United States', capital: 'Washington, D.C.', currency: 'USD', population: '340 Million' },
        { name: 'Canada', capital: 'Ottawa', currency: 'CAD', population: '40 Million' }
      ];
      await Country.insertMany(seedCountries);
      console.log('Initial countries seeded successfully in MySQL!');
    }

    // 4. Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
