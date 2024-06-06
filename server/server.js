const express = require('express');
const cors = require('cors');
const request = require('request');
const apiRoutes = require('./routes/index'); // Ensure this import is correct
const sequelize = require('./config/db'); // Ensure this import is correct

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Proxy route to fetch images over HTTPS
app.get('/proxy', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Missing image URL');
  }

  request(imageUrl).pipe(res);
});

// Routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
