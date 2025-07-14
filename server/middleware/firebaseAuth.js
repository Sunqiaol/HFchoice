const admin = require('firebase-admin');
const User = require('../models/user');

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'hfchoice-96de6'
    });
}

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await User.findOne({ where: { firebaseId: req.user.uid } });
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Admin role required.' });
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ error: 'Error verifying admin role' });
    }
};

module.exports = { verifyFirebaseToken, requireAdmin };