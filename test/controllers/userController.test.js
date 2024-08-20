const { expect } = require('chai');
const sinon = require('sinon');
const UserController = require('../../controllers/userController');
const UserService = require('../../services/UserService');

describe('userController', () => {

    describe('getUser', () => {
        it('should return 200 and the user if found', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'getUserById').resolves({ id: '1', username: 'testuser' });

            await UserController.getUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ id: '1', username: 'testuser' })).to.be.true;

            UserService.getUserById.restore();
        });

        it('should return 404 and an error message if user not found', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'getUserById').throws(new Error('User not found'));

            await UserController.getUser(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'User not found' })).to.be.true;

            UserService.getUserById.restore();
        });
    });

    describe('getAllUsers', () => {
        it('should return 200 and all users', async () => {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'getAllUsers').resolves([{ username: 'testuser' }]);

            await UserController.getAllUsers(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ username: 'testuser' }])).to.be.true;

            UserService.getAllUsers.restore();
        });
    });

});
