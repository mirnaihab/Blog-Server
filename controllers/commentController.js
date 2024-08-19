const CommentService = require('../services/CommentService');

exports.addComment = async (req, res) => {
    try {
        const comment = await CommentService.addComment(req.body, req.user._id, req.params.postId);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
