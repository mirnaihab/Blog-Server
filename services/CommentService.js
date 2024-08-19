const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.addComment = async (commentData, userId, postId) => {
    const comment = new Comment({
        ...commentData,
        user: userId,
    });
    await comment.save();

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    return comment;
};

exports.getAllComments = async () => {
    return await Comment.find();
};

exports.updateComment = async (commentId, commentData, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.author.toString() !== userId.toString()) {
        throw new Error('You are not allowed to edit this comment.');
    }
    Object.assign(comment, commentData);
    await comment.save();
    return comment;
};

exports.deleteComment = async (commentId, userId, userRoles) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.author.toString() !== userId.toString() && !userRoles.includes('Admin')) {
        throw new Error('You are not allowed to delete this comment.');
    }
    await comment.remove();
};