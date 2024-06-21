// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AuthenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ _id: decoded.id});
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = {
            id: user._id,
            username: user.username, 
        };
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = AuthenticateUser