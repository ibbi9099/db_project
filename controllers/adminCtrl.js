const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Create Admin (Restricted to Super Admins)
const createAdmin = async (req, res) => {
    try {
        // Validate super admin access
        if (req.user.userType !== 'SuperAdmin') {
            return res.status(403).send({ success: false, message: 'Access denied' });
        }

        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).send({ success: false, message: 'All fields are required' });
        }

        // Check if email already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the admin user
        await userModel.createUser(name, email, hashedPassword, 'Admin');
        res.status(201).send({
            success: true,
            message: 'Admin created successfully',
            admin: { name, email, userType: 'Admin' },
        });
    } catch (error) {
        console.error('Error in createAdmin:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

module.exports = { createAdmin };