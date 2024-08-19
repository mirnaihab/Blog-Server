const express = require('express');
const PostController = require('../controllers/postController');
const { authMiddleware, requireRoles } = require('../middleware/authMiddleware');
const { Roles } = require('../common/enums');

const router = express.Router();

router.post('', authMiddleware,requireRoles(Roles.CREATE_POSTS), PostController.createPost);
router.get('', authMiddleware, requireRoles(Roles.VIEW_POSTS),PostController.getAllPosts);
router.get('/:id', authMiddleware,requireRoles(Roles.VIEW_POST),PostController.getPostById);
router.put('/:id', authMiddleware, requireRoles(Roles.EDIT_POST), PostController.updatePost);
router.delete('/:id', authMiddleware,requireRoles(Roles.VIEW_POST),PostController.deletePost);

module.exports = router;
