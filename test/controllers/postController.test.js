const { expect } = require('chai');
const sinon = require('sinon');
const PostController = require('../../controllers/postController');
const PostService = require('../../services/PostService');

describe('PostController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createPost', () => {
        it('should create a post and return it', async () => {
            const req = {
                body: { title: 'New Post', body: 'This is a new post' },
                user: { _id: 'userId' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            const createPostStub = sinon.stub(PostService, 'createPost').resolves({
                title: 'New Post',
                body: 'This is a new post',
                author: 'userId'
            });

            await PostController.createPost(req, res);

            expect(createPostStub.calledOnceWith(req.body, req.user._id)).to.be.true;
            expect(res.status.calledOnceWith(201)).to.be.true;
            expect(res.json.calledOnceWith({
                title: 'New Post',
                body: 'This is a new post',
                author: 'userId'
            })).to.be.true;
        });

        it('should return 400 if there is an error', async () => {
            const req = {
                body: { title: 'New Post', body: 'This is a new post' },
                user: { _id: 'userId' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            sinon.stub(PostService, 'createPost').throws(new Error('Creation failed'));

            await PostController.createPost(req, res);

            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(res.json.calledOnceWith({ error: 'Creation failed' })).to.be.true;
        });
    });

    describe('getAllPosts', () => {
        it('should return all posts', async () => {
            const req = {};
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            const getAllPostsStub = sinon.stub(PostService, 'getAllPosts').resolves([
                { title: 'Post 1', body: 'Body 1' },
                { title: 'Post 2', body: 'Body 2' }
            ]);

            await PostController.getAllPosts(req, res);

            expect(getAllPostsStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith([
                { title: 'Post 1', body: 'Body 1' },
                { title: 'Post 2', body: 'Body 2' }
            ])).to.be.true;
        });

        it('should return 500 if there is an error', async () => {
            const req = {};
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            sinon.stub(PostService, 'getAllPosts').throws(new Error('Error retrieving posts'));

            await PostController.getAllPosts(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnceWith({ error: 'Error retrieving posts' })).to.be.true;
        });
    });

    describe('getPostById', () => {
        it('should return a post by ID', async () => {
            const req = {
                params: { id: 'postId' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
    
            const getPostByIdStub = sinon.stub(PostService, 'getPostById').resolves({
                title: 'Post 1',
                body: 'Body 1',
                author: 'userId'
            });
    
            await PostController.getPostById(req, res);
    
            expect(getPostByIdStub.calledOnceWith(req.params.id)).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith({
                title: 'Post 1',
                body: 'Body 1',
                author: 'userId'
            })).to.be.true;
        });
    
        it('should return 404 if post is not found', async () => {
            const req = {
                params: { id: 'nonexistentId' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
    
            sinon.stub(PostService, 'getPostById').throws(new Error('Post not found'));
    
            await PostController.getPostById(req, res);
    
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWith({ error: 'Post not found' })).to.be.true;
        });
    });
    
    describe('updatePost', () => {
        it('should update a post and return it', async () => {
            const req = {
                params: { id: 'postId' },
                body: { title: 'Updated Post', body: 'Updated body' },
                user: { _id: 'userId' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
    
            const updatePostStub = sinon.stub(PostService, 'updatePost').resolves({
                title: 'Updated Post',
                body: 'Updated body',
                author: 'userId'
            });
    
            await PostController.updatePost(req, res);
    
            expect(updatePostStub.calledOnceWith(req.params.id, req.body, req.user._id)).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith({
                title: 'Updated Post',
                body: 'Updated body',
                author: 'userId'
            })).to.be.true;
        });
    
        it('should return 403 if user is not allowed to update post', async () => {
            const req = {
                params: { id: 'postId' },
                body: { title: 'Updated Post', body: 'Updated body' },
                user: { _id: 'anotherUserId' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
    
            sinon.stub(PostService, 'updatePost').throws(new Error('You are not allowed to edit this post.'));
    
            await PostController.updatePost(req, res);
    
            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnceWith({ error: 'You are not allowed to edit this post.' })).to.be.true;
        });
    });

    describe('deletePost', () => {
        it('should delete a post', async () => {
            const req = {
                params: { id: 'postId' },
                user: { _id: 'userId' },
                userRoles: ['User']
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
    
            sinon.stub(PostService, 'deletePost').resolves();
    
            await PostController.deletePost(req, res);
    
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith({ message: 'Post deleted' })).to.be.true;
        });
    
        it('should return 403 if user is not allowed to delete post', async () => {
            const req = {
                params: { id: 'postId' },
                user: { _id: 'anotherUserId' },
                userRoles: ['User']
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
    
            sinon.stub(PostService, 'deletePost').throws(new Error('You are not allowed to delete this post.'));
    
            await PostController.deletePost(req, res);
    
            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnceWith({ error: 'You are not allowed to delete this post.' })).to.be.true;
        });
    });
    
    

});
