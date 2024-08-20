const { expect } = require('chai');
const sinon = require('sinon');
const AuthController = require('../../controllers/authController.js');
const UserService = require('../../services/UserService');

describe('authController', () => {

    describe('signup', () => {
        it('should return 201 and the user when registration is successful', async () => {
            const req = {
                body: { username: 'testuser', email: 'test@example.com', password: 'password', phoneNumber: '1234567890' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'registerUser').resolves(req.body);

            await AuthController.signup(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(req.body)).to.be.true;

            UserService.registerUser.restore();
        });

        it('should return 500 and an error message when registration fails', async () => {
            const req = {
                body: { username: 'testuser', email: 'test@example.com', password: 'password', phoneNumber: '1234567890' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'registerUser').throws(new Error('Registration failed'));

            await AuthController.signup(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Registration failed' })).to.be.true;

            UserService.registerUser.restore();
        });
    });

    describe('signin', () => {
        it('should return 200 and the user with token when login is successful', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'loginUser').resolves({ user: req.body, token: 'token' });

            await AuthController.signin(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ user: req.body, token: 'token' })).to.be.true;

            UserService.loginUser.restore();
        });

        it('should return 401 and an error message when login fails', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(UserService, 'loginUser').throws(new Error('Invalid credentials'));

            await AuthController.signin(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ error: 'Invalid credentials' })).to.be.true;

            UserService.loginUser.restore();
        });
    });

});
