const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


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

exports.generateResetToken= async() =>{
    return crypto.randomBytes(20).toString('hex');
}

exports.saveResetToken= async (user, token) =>{
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return await user.save();
}


exports.sendResetEmail= async (req, user, token) =>{
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://${req.headers.host}/reset/${token}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    return await transporter.sendMail(mailOptions);
}

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
