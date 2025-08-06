const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Order = require('../models/order');
const User = require('../models/user');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/firebaseAuth');
require('dotenv').config();

router.post('/checkout', verifyFirebaseToken, async (req, res) => {
    const { cart, userEmail, customerName, phone, notes } = req.body;
    const firebaseId = req.user.uid;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total items
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    try {
        // Save order to database
        const newOrder = await Order.create({
            firebaseId,
            email: userEmail,
            status: 'Quote',
            items: cart,
            totalItems,
            notes: notes || '',
            customerName: customerName || '',
            phone: phone || ''
        });

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.EMAIL_PASSWORD // Your email password (or app-specific password)
        }
    });

    // Helper function to format cart items
    const formatCartItems = (cartItems) => {
        return cartItems.map(item => {
            const quantity = item.quantity || 1;
            const description = item.DISCRIPCION || 'Unknown Product';
            const code = item.CODIGO || 'N/A';
            const brand = item.MARCA ? ` (${item.MARCA})` : '';
            return `• ${description}${brand}\n  Code: ${code}\n  Quantity: ${quantity}`;
        }).join('\n\n');
    };

        // Email content to store owner
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.RECIPIENT_EMAIL,
            subject: `New Quote Request #${newOrder.id} from ${userEmail}`,
            text: `You have received a new quote request:

Order ID: #${newOrder.id}
Customer: ${customerName || 'Not provided'}
Email: ${userEmail}
Phone: ${phone || 'Not provided'}
Date: ${new Date().toLocaleString()}

Order Details:
Total Items: ${totalItems}

Items Requested:
${formatCartItems(cart)}

${notes ? `Customer Notes: ${notes}` : ''}

Please review this request and respond with pricing and availability.`
        };

        // Confirmation email to customer
        const mailOptions2 = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: `Quote Request Confirmation #${newOrder.id} - HF Choice`,
            text: `Thank you for your quote request!

Order ID: #${newOrder.id}
Date: ${new Date().toLocaleString()}

We have received your request for the following items:

Order Summary:
Total Items: ${totalItems}

Items Requested:
${formatCartItems(cart)}

${notes ? `Your Notes: ${notes}` : ''}

What happens next:
• Our team will review your request
• We'll provide pricing and availability information
• You'll receive a response within 24 hours

You can track your order status by logging into your account.

If you have any questions, please reply to this email.

Best regards,
HF Choice Team`
        };


        // Send emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptions2);
        
        res.status(200).json({ 
            message: 'Quote request submitted successfully',
            orderId: newOrder.id,
            order: newOrder
        });
    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({ error: 'Error processing quote request' });
    }
});

// Get orders - Admin sees all, User sees only their own
router.get('/orders', verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseId = req.user.uid;
        
        // Get user role from database
        const user = await User.findOne({ where: { firebaseId } });
        const userRole = user ? user.role : 'User';

        let orders;
        if (userRole === 'Admin') {
            // Admin can see all orders
            orders = await Order.findAll({
                order: [['createdAt', 'DESC']]
            });
        } else {
            // Regular users can only see their own orders
            orders = await Order.findAll({
                where: { firebaseId },
                order: [['createdAt', 'DESC']]
            });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get single order by ID
router.get('/orders/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const orderId = req.params.id;
        const firebaseId = req.user.uid;
        
        // Get user role from database
        const user = await User.findOne({ where: { firebaseId } });
        const userRole = user ? user.role : 'User';

        let whereClause = { id: orderId };
        
        // If not admin, can only view own orders
        if (userRole !== 'Admin') {
            whereClause.firebaseId = firebaseId;
        }

        const order = await Order.findOne({ where: whereClause });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Error fetching order' });
    }
});

// Update order status (Admin only)
router.put('/orders/:id/status', verifyFirebaseToken, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const firebaseId = req.user.uid;
        
        // Get user role from database
        const user = await User.findOne({ where: { firebaseId } });
        const userRole = user ? user.role : 'User';

        if (userRole !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const validStatuses = ['Quote', 'Placed', 'Cancelled', 'Completed', 'shipped', 'delivering'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const [updatedRowsCount] = await Order.update(
            { status },
            { where: { id: orderId } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const updatedOrder = await Order.findByPk(orderId);
        res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Error updating order status' });
    }
});

module.exports = router;
