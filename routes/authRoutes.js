const express = require('express');
const { signup, signin, requestPasswordReset, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


module.exports = router;



