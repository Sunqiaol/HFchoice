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

    // Email content
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.RECIPIENT_EMAIL, // Your recipient email address
        subject: 'New Order Checkout',
        text: `You have a new order from ${userEmail} with the following items:\n\n${cart.map(item => `${item.discripcion} - ${item.codigo}`).join('\n')}`
    };

    const mailOptions2 = {
        from: process.env.EMAIL,
        to: userEmail, // Your recipient email address
        subject: 'New Order Checkout',
        text: `You Had place a with the following items:\n\n${cart.map(item => `${item.discripcion} - ${item.codigo}`).join('\n')}`
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
