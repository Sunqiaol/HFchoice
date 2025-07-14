const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/firebaseAuth');
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/getAllItems', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'An error occurred while fetching items' });
    }
});

router.post('/getItem', async (req, res) => {
    const { id } = req.body;
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

router.post('/addItem', verifyFirebaseToken, requireAdmin, async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json({ newItem });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'An error occurred while adding the item', details: error.message });
    }
});

router.put('/editItem', verifyFirebaseToken, requireAdmin, async (req, res) => {
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

router.delete('/deleteItem', verifyFirebaseToken, requireAdmin, async (req, res) => {
    const { id } = req.body;
    try {
        const item = await Item.findOne({ where: { id } });
        if (item) {
            await item.destroy();
            res.status(200).json({ message: 'Item deleted successfully' });
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
        const items = await Item.findAll({ where: { VISIBLE: true } });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'An error occurred while fetching items' });
    }
});

router.put('/toggleVisibility', verifyFirebaseToken, requireAdmin, async (req, res) => {
    const { id } = req.body;
    try {
        const item = await Item.findOne({ where: { id } });
        if (item) {
            item.VISIBLE = !item.VISIBLE;
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
