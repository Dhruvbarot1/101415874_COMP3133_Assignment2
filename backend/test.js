const path = require('path');

// Check the resolved path of User.js
const userPath = path.resolve(__dirname, '../models/User');
console.log('Resolved Path:', userPath);

// Try to require the User model
try {
    const User = require('../models/User');
    console.log('User model loaded:', typeof User);
} catch (error) {
    console.error('Error loading User model:', error);
}
