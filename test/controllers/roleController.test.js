const { expect } = require('chai');
const sinon = require('sinon');
const RoleController = require('../../controllers/roleController');
const RoleService = require('../../services/RoleService');
const Role = require('../../models/Role');

describe('roleController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getRoleById', () => {

        it('should return 404 if the role is not found', async () => {
            const req = { params: { id: '123' } };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            const roleFindByIdStub = sinon.stub(Role, 'findById').resolves(null);

            await RoleController.getRoleById(req, res);

            expect(roleFindByIdStub.calledOnceWith('123')).to.be.true;
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWith({ message: 'Role not found' })).to.be.true;
        });
    });

    describe('getAllRoles', () => {
        it('should return all roles', async () => {
            const req = {};
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            sinon.stub(RoleService, 'getAllRoles').resolves([{ name: 'admin' }, { name: 'user' }]);

            await RoleController.getAllRoles(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });
    });

    describe('createRole', () => {
        it('should create roles and return them', async () => {
            const req = { body: { roles: ['admin', 'user'] } };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            sinon.stub(RoleService, 'createRoles').resolves([{ name: 'admin' }, { name: 'user' }]);

            await RoleController.createRole(req, res);

            expect(res.status.calledOnceWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });
    });

    describe('deleteRole', () => {
        it('should delete a role and return a success message', async () => {
            const req = { params: { id: '123' } };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            sinon.stub(RoleService, 'deleteRole').resolves({ message: 'Role deleted successfully' });

            await RoleController.deleteRole(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith({ message: 'Role deleted successfully' })).to.be.true;
        });
    });

    describe('assignRoles', () => {
        it('should assign roles to a user and return the updated user', async () => {
            const req = {
                params: { id: '123' },
                body: { roles: ['admin', 'user'] },
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };

            sinon.stub(RoleService, 'assignRolesToUser').resolves({ name: 'John Doe', roles: ['admin', 'user'] });

            await RoleController.assignRoles(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });
    });
});
