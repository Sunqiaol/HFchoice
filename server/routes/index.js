const express = require('express');
const app = express();
const user = require('./user');
const item = require('./item');


app.use('/user',user);
app.use('/item',item);

module.exports = app;