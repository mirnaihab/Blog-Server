const UserService = require('../services/UserService');
const { Roles } = require('../common/enums');

exports.getUser = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error); 
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        const hasAssignRoles = user.roles.some(role => role.name === Roles.ASSIGN_ROLES);

        if (hasAssignRoles) {
            return res.status(403).json({ error: 'Cannot delete users with the AssignRoles role.' });
        }

        await UserService.deleteUser(req.params.id);
        res.status(200).json({ message: 'User successfully deleted.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
    try {
        const newUser = await UserService.registerUser({ username, email, password, phoneNumber });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

