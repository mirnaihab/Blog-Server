const express = require('express');
const PostController = require('../controllers/postController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.delete('/:id', authMiddleware, PostController.deletePost);

module.exports = router;
