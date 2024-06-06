const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');


const item = db.define('user', {
    picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
    codigo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    discripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    modelo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    marca:{
        type: DataTypes.STRING,
        allowNull: true
    },
    grupo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    unidad:{
        type: DataTypes.STRING,
        allowNull: true
    },
    costo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    p_a:{
        type: DataTypes.STRING,
        allowNull: true
    },
    p_b:{
        type: DataTypes.STRING,
        allowNull: true
    },
    p_c:{
        type: DataTypes.STRING,
        allowNull: true
    },
    p_d:{
        type: DataTypes.STRING,
        allowNull: true
    },
    inve:{
        type: DataTypes.STRING,
        allowNull: true
    },
    un_ctn:{
        type: DataTypes.STRING,
        allowNull: true
    },
    ctns:{
        type: DataTypes.STRING,
        allowNull: true
    },
    visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

   


}, {
    tableName: 'item', // Explicitly define the table name
    timestamps: false,  // Disable timestamps if not needed
});

module.exports = item;