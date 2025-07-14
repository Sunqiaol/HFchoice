const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/checkout', async (req, res) => {
    const { cart, userEmail } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).send('Cart is empty');
    }

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

    // Calculate total items
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    // Email content to store owner
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.RECIPIENT_EMAIL,
        subject: `New Quote Request from ${userEmail}`,
        text: `You have received a new quote request from: ${userEmail}

Order Details:
Total Items: ${totalItems}

Items Requested:
${formatCartItems(cart)}

Please review this request and respond with pricing and availability.

Customer Email: ${userEmail}`
    };

    // Confirmation email to customer
    const mailOptions2 = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Quote Request Confirmation - HF Choice',
        text: `Thank you for your quote request!

We have received your request for the following items:

Order Summary:
Total Items: ${totalItems}

Items Requested:
${formatCartItems(cart)}

What happens next:
• Our team will review your request
• We'll provide pricing and availability information
• You'll receive a response within 24 hours

If you have any questions, please reply to this email.

Best regards,
HF Choice Team`
    };


    try {
        // Send email
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptions2);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

module.exports = router;
