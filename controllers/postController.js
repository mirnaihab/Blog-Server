const PostService = require('../services/PostService');

exports.createPost = async (req, res) => {
    try {
        const post = await PostService.createPost(req.body, req.user._id);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await PostService.getPostById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await PostService.deletePost(req.params.id, req.user._id);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};
