const express = require('express');
const UserController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/:id', authMiddleware, UserController.getUser);
router.get('/', authMiddleware, UserController.getAllUsers);

module.exports = router;
