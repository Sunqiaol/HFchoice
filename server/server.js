const express = require('express');
const cors = require('cors');
const request = require('request');
const apiRoutes = require('./routes/index'); // Ensure this import is correct
const checkoutRoutes = require('./routes/checkout'); // Add this line

const app = express();
require('dotenv').config();

// Middleware
const allowedOrigins = ['https://hfchoice.onrender.com', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
