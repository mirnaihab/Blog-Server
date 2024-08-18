const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgetPassword} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forget-password', forgetPassword);


module.exports = router;