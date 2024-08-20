const { expect } = require('chai');
const sinon = require('sinon');
const CommentController = require('../../controllers/commentController');
const CommentService = require('../../services/CommentService');

describe('commentController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { _id: 'userId' },
            userRoles: []
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); 
    });

    describe('addComment', () => {
        it('should add a comment and return it', async () => {
            const commentData = { body: 'This is a comment' };
            req.body = commentData;
            req.params.postId = 'postId';
            
            const comment = { ...commentData, _id: 'commentId' };
            sinon.stub(CommentService, 'addComment').resolves(comment);

            await CommentController.addComment(req, res);

            expect(CommentService.addComment.calledOnce).to.be.true;
            expect(CommentService.addComment.calledWith(commentData, req.user._id, req.params.postId)).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(comment)).to.be.true;
        });

        it('should return 400 if there is an error', async () => {
            sinon.stub(CommentService, 'addComment').rejects(new Error('Failed to add comment'));

            await CommentController.addComment(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Failed to add comment' })).to.be.true;
        });
    });

    describe('getAllComments', () => {
        it('should return all comments', async () => {
            const comments = [{ body: 'Comment 1' }, { body: 'Comment 2' }];
            sinon.stub(CommentService, 'getAllComments').resolves(comments);

            await CommentController.getAllComments(req, res);

            expect(CommentService.getAllComments.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(comments)).to.be.true;
        });

        it('should return 500 if there is an error', async () => {
            sinon.stub(CommentService, 'getAllComments').rejects(new Error('Failed to get comments'));

            await CommentController.getAllComments(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Failed to get comments' })).to.be.true;
        });
    });

    describe('updateComment', () => {
        it('should update a comment and return it', async () => {
            const commentData = { body: 'Updated comment' };
            req.body = commentData;
            req.params.id = 'commentId';

            const updatedComment = { ...commentData, _id: 'commentId' };
            sinon.stub(CommentService, 'updateComment').resolves(updatedComment);

            await CommentController.updateComment(req, res);

            expect(CommentService.updateComment.calledOnce).to.be.true;
            expect(CommentService.updateComment.calledWith(req.params.id, commentData, req.user._id)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(updatedComment)).to.be.true;
        });

        it('should return 403 if the user is not allowed to update the comment', async () => {
            sinon.stub(CommentService, 'updateComment').rejects(new Error('You are not allowed to edit this comment.'));

            await CommentController.updateComment(req, res);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWith({ error: 'You are not allowed to edit this comment.' })).to.be.true;
        });
    });

    describe('deleteComment', () => {
        it('should delete a comment and return success message', async () => {
            req.params.id = 'commentId';

            sinon.stub(CommentService, 'deleteComment').resolves();

            await CommentController.deleteComment(req, res);

            expect(CommentService.deleteComment.calledOnce).to.be.true;
            expect(CommentService.deleteComment.calledWith(req.params.id, req.user._id, req.userRoles)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Comment deleted' })).to.be.true;
        });

        it('should return 403 if the user is not allowed to delete the comment', async () => {
            sinon.stub(CommentService, 'deleteComment').rejects(new Error('You are not allowed to delete this comment.'));

            await CommentController.deleteComment(req, res);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWith({ error: 'You are not allowed to delete this comment.' })).to.be.true;
        });
    });
});
