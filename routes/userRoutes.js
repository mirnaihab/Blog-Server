const express = require('express');
const UserController = require('../controllers/userController');
const { authMiddleware, requireRoles } = require('../middleware/authMiddleware');
const { Roles } = require('../common/enums');
const router = express.Router();


router.get('/:id', authMiddleware,requireRoles(Roles.VIEW_USER), UserController.getUser);
router.get('', authMiddleware,requireRoles(Roles.VIEW_USERS), UserController.getAllUsers);
router.put('/:id', authMiddleware, requireRoles(Roles.EDIT_USER), UserController.updateUser);
router.delete('/:id', authMiddleware, requireRoles(Roles.DELETE_USER), UserController.deleteUser);
router.post('', authMiddleware, requireRoles(Roles.CREATE_USER), UserController.createUser);

module.exports = router;
