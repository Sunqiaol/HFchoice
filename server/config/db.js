const Sequelize = require('sequelize');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Sequelize with database credentials
const sequelize = new Sequelize(
    'HFchoice_perhapsyou',
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: 3307,
        dialect: 'mysql',
        logging: false,
    }
);

// Test the connection to the database
sequelize
    .authenticate()
    .then(() => {
        // Database connection successful
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize; 