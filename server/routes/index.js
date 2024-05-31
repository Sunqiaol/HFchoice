const express = require('express');
const app = express();
const user = require('./user');



app.use('/user',user);

module.exports = app;