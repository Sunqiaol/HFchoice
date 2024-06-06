// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // Ensure the path is correct

// Middleware to parse JSON and URL-encoded data
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Get all items
router.get('/getAllItems', async (req, res) => {
    try {
        const items = await Item.findAll(); // Fetch all items from the database
        res.status(200).json(items); // Send the items as a JSON response
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'An error occurred while fetching items' });
    }
});

// Get a single item
router.post('/getItem', async (req, res) => { // Changed to POST to match frontend
    const { id } = req.body; // Extract id from request body
    try {
        const item = await Item.findOne({ where: { id } });
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'An error occurred while fetching item' });
    }
});

// Add a new item
router.post('/addItem', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json({ newItem });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'An error occurred while adding the item', details: error.message });
    }
});

// Edit an item
router.put('/editItem', async (req, res) => {
    const { id } = req.body;
    try {
        const item = await Item.findOne({ where: { id } });
        if (item) {
            await item.update(req.body);
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'An error occurred while updating the item' });
    }
});

// Delete an item
router.delete('/deleteItem', async (req, res) => {
    const { id } = req.body;
    try {
        const item = await Item.findOne({ where: { id } });
        if (item) {
            await item.destroy();
            res.status(200).json({ message: 'Item deleted' });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'An error occurred while deleting the item' });
    }
});

router.get('/getVisibleItems', async (req, res) => {
    try {
        const items = await Item.findAll({ where: { visible: true } }); // Fetch all visible items from the database
        res.status(200).json(items); // Send the items as a JSON response
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'An error occurred while fetching items' });
    }
});

// Toggle visibility of an item
router.put('/toggleVisibility', async (req, res) => {
    const { id } = req.body;
    try {
        const item = await Item.findOne({ where: { id } });
        if (item) {
            item.visible = !item.visible; // Toggle visibility
            await item.save();
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error toggling visibility:', error);
        res.status(500).json({ error: 'An error occurred while toggling visibility' });
    }
});


module.exports = router;
