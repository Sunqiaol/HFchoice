const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');


const user = db.define('user', {
    firebaseId: {
        type: DataTypes.STRING,
        allowNull: false
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Admin','Viewer'),
        allowNull: false
    }


}, {
    tableName: 'user', // Explicitly define the table name
    timestamps: false,  // Disable timestamps if not needed
});

module.exports = user;