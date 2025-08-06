const Order = require('./models/order');
const User = require('./models/user');
const Item = require('./models/item');
const Cart = require('./models/cart');
const db = require('./config/db');

async function syncDatabase() {
  try {
    // Test connection
    await db.authenticate();
    console.log('Database connection successful');

    // Sync all models
    await db.sync({ alter: true }); // alter: true will update existing tables
    console.log('Database sync completed successfully');
    
    // Check if tables exist
    const tables = await db.query("SHOW TABLES", { type: db.QueryTypes.SELECT });
    console.log('Available tables:', tables);
    
    process.exit(0);
  } catch (error) {
    console.error('Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();