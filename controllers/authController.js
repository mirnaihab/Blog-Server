const User = require('../models/User');
const UserService = require('../services/UserService');
const Role = require('../models/Role');


exports.signup = async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
    try {
        const newUser = await UserService.registerUser({ username, email, password, phoneNumber });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.signin = async (req, res) => {
    try {
        const { user, token } = await UserService.loginUser(req.body);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};


const nodemailer = require('nodemailer');


exports.requestPasswordReset = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = await UserService.saveResetToken(user);

        await UserService.sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset token generated and email sent.' });
    } catch (err) {
        next(err);
    }
};
// exports.requestPasswordReset = async (req, res, next) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const resetToken = await UserService.saveResetToken(user);

//         // You can send the resetToken via email or another method
//         res.status(200).json({ message: 'Password reset token generated', resetToken });
//     } catch (err) {
//         next(err);
//     }
// };


exports.resetPassword = async (req, res, next) => {
    try {
        const user = await UserService.findUserByResetToken(req.params.token);
        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
        }

        user.password = await UserService.hashPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        next(error);
    }
};


