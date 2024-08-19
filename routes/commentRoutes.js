const express = require('express');
const CommentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:postId', authMiddleware, CommentController.addComment);

module.exports = router;
