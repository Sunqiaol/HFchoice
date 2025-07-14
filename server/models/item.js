const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');


const item = db.define('item', {
    CODIGO: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DISCRIPCION: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MODELO:{
        type: DataTypes.STRING,
        allowNull: true
    },
    MARCA:{
        type: DataTypes.STRING,
        allowNull: true
    },
    GRUPO:{
        type: DataTypes.STRING,
        allowNull: true
    },
    UNIDAD:{
        type: DataTypes.STRING,
        allowNull: true
    },
    COSTO:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    P_A:{
        type: DataTypes.STRING,
        allowNull: true
    },
    P_B:{
        type: DataTypes.STRING,
        allowNull: true
    },
    P_C:{
        type: DataTypes.STRING,
        allowNull: true
    },
    P_D:{
        type: DataTypes.STRING,
        allowNull: true
    },
    INVE:{
        type: DataTypes.STRING,
        allowNull: true
    },
    UN_CTN:{
        type: DataTypes.STRING,
        allowNull: true
    },
    CTNS:{
        type: DataTypes.STRING,
        allowNull: true
    },
    VISIBLE: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

   


}, {
    tableName: 'item', // Explicitly define the table name
    timestamps: false,  // Disable timestamps if not needed
});

module.exports = item;