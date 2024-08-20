const { expect } = require('chai');
const sinon = require('sinon');
const PostService = require('../../services/PostService');
const Post = require('../../models/Post');

describe('PostService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createPost', () => {
        it('should create a post and return it', async () => {
            const postData = { title: 'New Post', body: 'This is a new post' };
            const userId = 'userId';
    
            const postSaveStub = sinon.stub(Post.prototype, 'save').resolves({
                ...postData,
                author: userId,

            });
    
            const result = await PostService.createPost(postData, userId);
    
            expect(postSaveStub.calledOnce).to.be.true;
    
            expect(result).to.include({
                title: 'New Post',
                body: 'This is a new post'
            });
        });
    });


    describe('updatePost', () => {
        it('should update a post and return it', async () => {
            const postId = 'postId';
            const postData = { title: 'Updated Post', body: 'Updated body' };
            const userId = 'userId';
    
            const existingPost = { 
                _id: postId, 
                author: userId, 
                title: 'Old Post', 
                body: 'Old body',
                save: sinon.stub().resolves() 
            };
    
            sinon.stub(Post, 'findById').resolves(existingPost);
    
            const result = await PostService.updatePost(postId, postData, userId);
    
            expect(existingPost.save.calledOnce).to.be.true;
            expect(result).to.include({ title: 'Updated Post', body: 'Updated body' });
        });
    
        it('should throw an error if the post is not found', async () => {
            const postId = 'nonexistentId';
            const postData = { title: 'Updated Post', body: 'Updated body' };
            const userId = 'userId';
    
            sinon.stub(Post, 'findById').resolves(null);
    
            try {
                await PostService.updatePost(postId, postData, userId);
            } catch (error) {
                expect(error.message).to.equal('Post not found');
            }
        });
    
        it('should throw an error if user is not allowed to update the post', async () => {
            const postId = 'postId';
            const postData = { title: 'Updated Post', body: 'Updated body' };
            const userId = 'anotherUserId';
    
            const existingPost = { 
                _id: postId, 
                author: 'userId', 
                title: 'Old Post', 
                body: 'Old body',
                save: sinon.stub().resolves() 
            };
    
            sinon.stub(Post, 'findById').resolves(existingPost);
    
            try {
                await PostService.updatePost(postId, postData, userId);
            } catch (error) {
                expect(error.message).to.equal('You are not allowed to edit this post.');
            }
        });
    });
    
    describe('deletePost', () => {
        it('should delete a post', async () => {
            const postId = 'postId';
            const userId = 'userId';
            const userRoles = ['User'];
    
            const existingPost = { _id: postId, author: userId };
    
            sinon.stub(Post, 'findById').resolves(existingPost);
            sinon.stub(Post, 'deleteOne').resolves();
    
            await PostService.deletePost(postId, userId, userRoles);
    
            expect(Post.deleteOne.calledOnceWith({ _id: postId })).to.be.true;
        });
    
        it('should throw an error if the post is not found', async () => {
            const postId = 'nonexistentId';
            const userId = 'userId';
            const userRoles = ['User'];
    
            sinon.stub(Post, 'findById').resolves(null);
    
            try {
                await PostService.deletePost(postId, userId, userRoles);
            } catch (error) {
                expect(error.message).to.equal('Post not found');
            }
        });
    
        it('should throw an error if user is not allowed to delete the post', async () => {
            const postId = 'postId';
            const userId = 'anotherUserId';
            const userRoles = ['User'];
    
            const existingPost = { _id: postId, author: 'userId' };
    
            sinon.stub(Post, 'findById').resolves(existingPost);
    
            try {
                await PostService.deletePost(postId, userId, userRoles);
            } catch (error) {
                expect(error.message).to.equal('You are not allowed to delete this post.');
            }
        });
    });
    
});
