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
    return await Post.find().populate('author', 'username').populate('comments');
};

exports.getPostById = async (id) => {
    const post = await Post.findById(id).populate('author', 'username').populate('comments');
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
};

exports.updatePost = async (postId, postData, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.author.toString() !== userId.toString()) {
        throw new Error('You are not allowed to edit this post.');
    }
    Object.assign(post, postData);
    await post.save();
    return post;
};

exports.deletePost = async (postId, userId, userRoles) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.author.toString() !== userId.toString() && !userRoles.includes('Admin')) {
        throw new Error('You are not allowed to delete this post.');
    }
    await Post.deleteOne({ _id: postId });

    //await post.remove();
};