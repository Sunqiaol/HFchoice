const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Test route without authentication to check if database operations work
router.post('/test-order', async (req, res) => {
    try {
        console.log('Test order request:', req.body);
        
        const { cart, userEmail, customerName, phone, notes } = req.body;
        
        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

        // Create test order with dummy firebaseId
        const newOrder = await Order.create({
            firebaseId: 'test-user-123',
            email: userEmail || 'test@example.com',
            status: 'Quote',
            items: cart,
            totalItems,
            notes: notes || '',
            customerName: customerName || '',
            phone: phone || ''
        });

        res.status(200).json({ 
            message: 'Test order created successfully',
            orderId: newOrder.id,
            order: newOrder
        });
    } catch (error) {
        console.error('Error creating test order:', error);
        res.status(500).json({ error: 'Error creating test order: ' + error.message });
    }
});

// Test route to get all orders
router.get('/test-orders', async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching test orders:', error);
        res.status(500).json({ error: 'Error fetching orders: ' + error.message });
    }
});

module.exports = router;