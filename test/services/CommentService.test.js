const { expect } = require('chai');
const sinon = require('sinon');
const CommentService = require('../../services/CommentService');
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');

describe('CommentService', () => {
    let comment, post;

    beforeEach(() => {
        comment = {
            _id: 'commentId',
            save: sinon.stub()
        };

        post = {
            comments: [],
            save: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); 
    });

    describe('addComment', () => {
        it('should add a comment and update the post', async () => {
            const commentData = { body: 'This is a comment' };
            const postId = 'postId';
    
            sinon.stub(Comment.prototype, 'save').resolves(comment);
            sinon.stub(Post, 'findById').resolves(post);
    
            await CommentService.addComment(commentData, 'userId', postId);
    
            expect(Comment.prototype.save.calledOnce).to.be.true;
            expect(Post.findById.calledOnceWith(postId)).to.be.true;
    
            expect(post.comments); 
            expect(post.save.calledOnce).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(Comment.prototype, 'save').rejects(new Error('Save failed'));
            sinon.stub(Post, 'findById').resolves(post);

            try {
                await CommentService.addComment({}, 'userId', 'postId');
            } catch (error) {
                expect(error.message).to.equal('Save failed');
            }
        });
    });

    describe('updateComment', () => {
        it('should update a comment and return it', async () => {
            const commentData = { body: 'Updated comment' };
            const commentId = 'commentId';
            const userId = 'userId';
    
            sinon.stub(Comment, 'findById').resolves({
                _id: commentId,
                author: userId,
                ...commentData,
                save: sinon.stub().resolves({ ...commentData, _id: commentId })
            });
    
            const updatedComment = await CommentService.updateComment(commentId, commentData, userId);
    
            expect(Comment.findById.calledOnceWith(commentId)).to.be.true;
            expect(updatedComment.body).to.equal('Updated comment');
        });
    
        it('should handle errors', async () => {
            sinon.stub(Comment, 'findById').resolves(null);
    
            try {
                await CommentService.updateComment('commentId', {}, 'userId');
            } catch (error) {
                expect(error.message).to.equal('Comment not found');
            }
        });
    });
    
});
