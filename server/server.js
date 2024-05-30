const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes//index');
const sequelize = require('./config/db');
const app = express();
require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


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