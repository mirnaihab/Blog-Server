const Role = require('../models/Role'); 
const RoleService = require('../services/RoleService');


exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await RoleService.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const result = await RoleService.deleteRole(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.createRole = async (req, res) => {
    const { roles } = req.body;

    if (!roles) {
        return res.status(400).json({ message: 'Roles data is required' });
    }

    try {
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        const createdRoles = await RoleService.createRoles(rolesArray);
        res.status(201).json(createdRoles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.assignRoles = async (req, res) => {
    const { roles } = req.body; 
    const userId = req.params.id; 

    try {
        if (!roles || !userId) {
            return res.status(400).json({ message: 'User ID and roles are required' });
        }

        const updatedUser = await RoleService.assignRolesToUser(userId, roles);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};