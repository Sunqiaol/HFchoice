const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Cart = db.define('cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firebaseId: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true // Index for faster queries by user
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'item',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    // Store item data snapshot for consistency
    itemSnapshot: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Snapshot of item data when added to cart'
    },
    // Track when item was added to cart
    addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'cart',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['firebaseId', 'itemId'] // Prevent duplicate items per user
        },
        {
            fields: ['firebaseId'] // Index for user cart queries
        },
        {
            fields: ['addedAt'] // Index for cleanup old carts
        }
    ]
});

module.exports = Cart;