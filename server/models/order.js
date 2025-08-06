const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');


const order = db.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firebaseId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Quote','Placed','Cancelled', 'Completed', 'shipped', 'delivering'),
        allowNull: false,
        defaultValue: 'Quote'
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    totalItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = order;