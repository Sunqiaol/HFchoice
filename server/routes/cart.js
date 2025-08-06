const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Item = require('../models/item');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');

// Get user's cart
router.get('/', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;
        
        const cartItems = await Cart.findAll({
            where: { firebaseId },
            order: [['addedAt', 'ASC']] // Oldest items first
        });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Error fetching cart' });
    }
});

// Add item to cart
router.post('/add', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;
        const { itemId, quantity = 1 } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
        }

        // Get the item details for snapshot
        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Check if item already exists in cart
        const existingCartItem = await Cart.findOne({
            where: { firebaseId, itemId }
        });

        if (existingCartItem) {
            // Update quantity if item already in cart
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            
            res.status(200).json({
                message: 'Cart updated',
                cartItem: existingCartItem
            });
        } else {
            // Add new item to cart
            const cartItem = await Cart.create({
                firebaseId,
                itemId,
                quantity,
                itemSnapshot: {
                    id: item.id,
                    CODIGO: item.CODIGO,
                    DISCRIPCION: item.DISCRIPCION,
                    MARCA: item.MARCA,
                    UNIDAD: item.UNIDAD,
                    COSTO: item.COSTO,
                    imagen: item.imagen,
                    visible: item.visible
                }
            });

            res.status(201).json({
                message: 'Item added to cart',
                cartItem
            });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
});

// Update cart item quantity
router.put('/update/:cartItemId', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }

        const cartItem = await Cart.findOne({
            where: {
                id: cartItemId,
                firebaseId // Ensure user owns this cart item
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            message: 'Cart item updated',
            cartItem
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Error updating cart item' });
    }
});

// Remove item from cart
router.delete('/remove/:cartItemId', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;
        const { cartItemId } = req.params;

        const result = await Cart.destroy({
            where: {
                id: cartItemId,
                firebaseId // Ensure user owns this cart item
            }
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ error: 'Error removing cart item' });
    }
});

// Clear entire cart
router.delete('/clear', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;

        await Cart.destroy({
            where: { firebaseId }
        });

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
});

// Get cart summary (total items, total value)
router.get('/summary', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;
        
        const cartItems = await Cart.findAll({
            where: { firebaseId }
        });

        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.itemSnapshot.COSTO) || 0;
            return sum + (price * item.quantity);
        }, 0);

        res.status(200).json({
            totalItems,
            totalValue: parseFloat(totalValue.toFixed(2)),
            itemCount: cartItems.length
        });
    } catch (error) {
        console.error('Error getting cart summary:', error);
        res.status(500).json({ error: 'Error getting cart summary' });
    }
});

// Cleanup old cart items (for maintenance - admin only)
router.delete('/cleanup', verifyFirebaseToken, async (req, res) => {
    try {
        // Only allow admin users to run cleanup
        // You can add admin check here if needed
        
        const daysOld = req.query.days || 30; // Default to 30 days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await Cart.destroy({
            where: {
                addedAt: {
                    [require('sequelize').Op.lt]: cutoffDate
                }
            }
        });

        res.status(200).json({
            message: `Cleaned up ${result} old cart items`,
            cutoffDate
        });
    } catch (error) {
        console.error('Error cleaning up cart:', error);
        res.status(500).json({ error: 'Error cleaning up cart' });
    }
});

module.exports = router;