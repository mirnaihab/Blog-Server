const express = require('express');
const CommentController = require('../controllers/commentController');
const { authMiddleware, requireRoles } = require('../middleware/authMiddleware');
const { Roles } = require('../common/enums');

const router = express.Router();

router.post('/:postId', authMiddleware, requireRoles(Roles.CREATE_COMMENT), CommentController.addComment);
router.get('', authMiddleware, requireRoles(Roles.VIEW_COMMENTS),CommentController.getAllComments);
router.put('/:id', authMiddleware, requireRoles(Roles.EDIT_COMMENT), CommentController.updateComment);
router.delete('/:id', authMiddleware, requireRoles(Roles.DELETE_COMMENT), CommentController.deleteComment);

module.exports = router;

