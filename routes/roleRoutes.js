const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authMiddleware, requireRoles } = require('../middleware/authMiddleware');
const { Roles } = require('../common/enums');

router.get('/roles/:id', authMiddleware, requireRoles(Roles.VIEW_ROLE), roleController.getRoleById);
router.get('/roles', authMiddleware, requireRoles(Roles.VIEW_ROLE), roleController.getAllRoles);


// router.post('/roles', authMiddleware, requireRoles(Roles.CREATE_ROLE), roleController.createRole);
router.post('/roles', authMiddleware, roleController.createRole);


// router.post('/assignRoles/:id', requireRoles(Roles.ASSIGN_ROLES), authMiddleware, roleController.assignRoles);
router.post('/assignRoles/:id',  authMiddleware, roleController.assignRoles);


router.delete('/roles/:id', authMiddleware,requireRoles(Roles.DELETE_ROLE),roleController.deleteRole);

module.exports = router;