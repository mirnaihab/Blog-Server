const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.registerUser = async ({ username, email, password, phoneNumber }) => {
    const user = new User({ username, email, password, phoneNumber });

    user.password = await bcrypt.hash(user.password, 8);

    await user.save();
    return user;
};


exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const roles = user.roles.map(role => role.name);

    const token = jwt.sign({ id: user._id , roles}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};

exports.getUserById = async (id) => {
    const user = await User.findById(id).populate('roles');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.getAllUsers = async () => {
    return await User.find();
};

exports.updateUser = async (id, updateData) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    Object.assign(user, updateData);

    if (updateData.password) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    await user.save();
    return user;
};

exports.deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
};


exports.findUserByEmail= async(email) =>{
    return await User.findOne({ email });
}

exports.findUserByResetToken= async (token) =>{
    return await User.findOne({ resetPasswordToken: token });
}

exports.generateResetToken = async () => {
    try {
        const buffer = await new Promise((resolve, reject) => {
            crypto.randomBytes(20, (err, buf) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf);
                }
            });
        });

        return buffer.toString('hex');
    } catch (err) {
        throw new Error('Failed to generate reset token');
    }
};

exports.saveResetToken = async (user) => {
    const resetToken = await this.generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();
    return resetToken;
};


exports.sendResetEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log('Sending email with:', {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            to: email,
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Use this token to reset your password: ${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        console.log('Password reset email sent to:', email);
    } catch (err) {
        console.error('Failed to send reset email:', err);
        throw new Error('Failed to send reset email');
    }
};



// exports.sendResetEmail = async (email, resetToken) => {
//     try {
       
//         const transporter = nodemailer.createTransport({
//             service: 'Gmail', 
//             auth: {
//                 user: process.env.EMAIL_USER, 
//                 pass: process.env.EMAIL_PASS, 
//             },
//         });

        
//         const mailOptions = {
//             from: process.env.EMAIL_USER, 
//             to: email, 
//             subject: 'Password Reset Request',
//             text: `You requested a password reset. Use this token to reset your password: ${resetToken}`,
//             };

//         await transporter.sendMail(mailOptions);

//         console.log('Password reset email sent to:', email);
//     } catch (err) {
//         console.error('Failed to send reset email:', err);
//         throw new Error('Failed to send reset email');
//     }
// };

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
