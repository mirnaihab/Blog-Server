const User = require('../models/User');
const Role = require('../models/Role'); 
const mongoose = require('mongoose');


exports.assignRolesToUser = async (userId, roleNames) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const roles = await Role.find({ name: { $in: roleNames } });
    if (roles.length === 0) {
        throw new Error('No valid roles found');
    }

    const existingRoleIds = new Set(user.roles.map(roleId => roleId.toString()));

    const newRoleIds = roles.map(role => role._id.toString());
    newRoleIds.forEach(roleId => existingRoleIds.add(roleId));

    user.roles = Array.from(existingRoleIds).map(roleId => new mongoose.Types.ObjectId(roleId));

    await user.save();
    return user;
};

exports.getAllRoles = async () => {
    return await Role.find();
};

exports.deleteRole = async (roleId) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new Error('Role not found');
    }

    await User.updateMany(
        { roles: role._id },
        { $pull: { roles: role._id } }
    );

    await role.remove();
    return { message: 'Role deleted successfully' };
};

const createRole = async (roleName) => {
    const existingRole = await Role.findOne({ name: roleName });
    if (existingRole) {
        return existingRole;
    }
    
    const newRole = new Role({ name: roleName });
    await newRole.save();
    return newRole;
};


exports.createRoles = async (rolesArray) => {
    const createdRoles = [];
    
    for (const role of rolesArray) {
        if (typeof role !== 'string') {
            throw new Error('Role names must be strings');
        }

        const roleData = await createRole(role);
        createdRoles.push(roleData);
    }

    return createdRoles;
};


