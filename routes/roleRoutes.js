const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/roles/:id', roleController.getRoleById);

router.post('/roles', roleController.createRole);

router.post('/assignRoles/:id', roleController.assignRoles);

module.exports = router;