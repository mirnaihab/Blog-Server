const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
    //const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header missing or incorrectly formatted' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.userRoles = user.roles.map(role => role.name); 
        next();

    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

exports.requireRoles = (...requiredRoles) => {
    return (req, res, next) => {
        const userRoles = req.userRoles || [];
        const hasRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ error: 'You do not have the required permissions to access this resource.' });
        }

        next();
    };
};
