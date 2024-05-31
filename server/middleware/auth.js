// middleware/auth.js
const User = require('../models/user'); // Ensure the path is correct

const checkAdminRole = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { firebaseId: req.user.uid } });
        if (user && user.role === 'Admin') {
            next(); // User is admin, proceed to the next middleware/route handler
        } else {
            res.status(403).json({ error: 'Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ error: 'An error occurred while checking admin role' });
    }
};

module.exports = checkAdminRole;
