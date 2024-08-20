const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserService = require('../../services/UserService');
const User = require('../../models/User');

describe('UserService', () => {
    
    describe('registerUser', () => {
        it('should hash the password and save the user', async () => {
            const userData = { username: 'testuser', email: 'test@example.com', password: 'password', phoneNumber: '1234567890' };
            const hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
            const saveStub = sinon.stub(User.prototype, 'save').resolves(userData);

            const user = await UserService.registerUser(userData);

            expect(user.password).to.equal('hashedpassword');
            expect(saveStub.calledOnce).to.be.true;

            hashStub.restore();
            saveStub.restore();
        });
    });

    describe('loginUser', () => {
        it('should return a token and user if credentials are valid', async () => {
            const userData = { email: 'test@example.com', password: 'password', roles: ['user'] };
            const userStub = sinon.stub(User, 'findOne').resolves(userData);
            const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
            const signStub = sinon.stub(jwt, 'sign').returns('token');

            const { user, token } = await UserService.loginUser(userData);

            expect(user).to.deep.equal(userData);
            expect(token).to.equal('token');

            userStub.restore();
            compareStub.restore();
            signStub.restore();
        });

        it('should throw an error if credentials are invalid', async () => {
            const userStub = sinon.stub(User, 'findOne').resolves(null);

            try {
                await UserService.loginUser({ email: 'test@example.com', password: 'wrongpassword' });
            } catch (error) {
                expect(error.message).to.equal('Invalid credentials');
            }

            userStub.restore();
        });
    });

    describe('saveResetToken', () => {
        it('should save reset token and expiration date', async () => {
            const user = new User({ email: 'test@example.com' });
            const tokenStub = sinon.stub(UserService, 'generateResetToken').resolves('resettoken');
            const saveStub = sinon.stub(user, 'save').resolves(user);

            const resetToken = await UserService.saveResetToken(user);

            expect(resetToken).to.equal('resettoken');
            expect(user.resetPasswordToken).to.equal('resettoken');
            expect(user.resetPasswordExpires).to.be.a('date');
            expect(saveStub.calledOnce).to.be.true;

            tokenStub.restore();
            saveStub.restore();
        });
    });

    describe('sendResetEmail', () => {
        it('should send reset email with the provided token', async () => {
            const sendMailStub = sinon.stub().resolves();
            const createTransportStub = sinon.stub(nodemailer, 'createTransport').returns({ sendMail: sendMailStub });

            await UserService.sendResetEmail('test@example.com', 'resettoken');

            expect(sendMailStub.calledOnce).to.be.true;
            expect(sendMailStub.firstCall.args[0].to).to.equal('test@example.com');

            createTransportStub.restore();
        });
    });
});
