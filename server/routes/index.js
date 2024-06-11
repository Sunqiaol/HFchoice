const express = require('express');
const app = express();
const user = require('./user');
const item = require('./item');
const checkout = require('./checkout');

app.use('/user',user);
app.use('/item',item);
app.use('/checkout',checkout)
module.exports = app;