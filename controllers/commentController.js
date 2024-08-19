const CommentService = require('../services/CommentService');

exports.addComment = async (req, res) => {
    try {
        const comment = await CommentService.addComment(req.body, req.user._id, req.params.postId);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await CommentService.getAllComments();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const updatedComment = await CommentService.updateComment(req.params.id, req.body, req.user._id);
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await CommentService.deleteComment(req.params.id, req.user._id, req.userRoles);
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};