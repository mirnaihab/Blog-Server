const Post = require('../models/Post');

exports.createPost = async (postData, userId) => {
    const post = new Post({
        ...postData,
        author: userId,
    });
    await post.save();
    return post;
};

exports.getAllPosts = async () => {
    return await Post.find().populate('author', 'username');
};

exports.getPostById = async (id) => {
    const post = await Post.findById(id).populate('author', 'username').populate('comments');
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
};

exports.deletePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (post.author.toString() !== userId) {
        throw new Error('Not authorized to delete this post');
    }
    await post.remove();
};
