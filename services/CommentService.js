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
