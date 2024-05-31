const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure the path is correct

// Middleware to parse JSON and URL-encoded data
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Get all users
router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.findAll(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

// Get a single user
router.post('/getUser', async (req, res) => { // Changed to POST to match frontend
    const { uid } = req.body; // Extract uid from request body
    try {
        const user = await User.findOne({ where: { firebaseId: uid } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching user' });
    }
});

// Add a new user
router.post('/addUser', async (req, res) => {
    const { firebaseId, email, role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = await User.create({ firebaseId, email, role });
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user', details: error.message });
    }
});

module.exports = router;
