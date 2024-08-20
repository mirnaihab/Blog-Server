const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const RoleService = require('../../services/RoleService');
const User = require('../../models/User');
const Role = require('../../models/Role');

describe('RoleService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('assignRolesToUser', () => {
        it('should assign roles to a user', async () => {
            const userId = new mongoose.Types.ObjectId();
            const roles = ['admin', 'user'];

            const userStub = sinon.stub(User, 'findById').resolves({
                _id: userId,
                roles: [],
                save: sinon.stub().resolvesThis(),
            });

            const roleStub = sinon.stub(Role, 'find').resolves([
                { _id: new mongoose.Types.ObjectId(), name: 'admin' },
                { _id: new mongoose.Types.ObjectId(), name: 'user' },
            ]);

            const result = await RoleService.assignRolesToUser(userId, roles);

            expect(userStub.calledOnce).to.be.true;
            expect(roleStub.calledOnce).to.be.true;
            expect(result.roles).to.have.lengthOf(2);
        });

        it('should throw an error if the user is not found', async () => {
            const userId = new mongoose.Types.ObjectId();
            sinon.stub(User, 'findById').resolves(null);

            try {
                await RoleService.assignRolesToUser(userId, ['admin']);
            } catch (error) {
                expect(error.message).to.equal('User not found');
            }
        });
    });

    describe('getAllRoles', () => {
        it('should return all roles', async () => {
            const roleStub = sinon.stub(Role, 'find').resolves([{ name: 'admin' }, { name: 'user' }]);
            const roles = await RoleService.getAllRoles();

            expect(roleStub.calledOnce).to.be.true;
            expect(roles).to.have.lengthOf(2);
        });
    });

    describe('deleteRole', () => {
        it('should delete a role and remove it from users', async () => {
            const roleId = new mongoose.Types.ObjectId();
            const roleStub = sinon.stub(Role, 'findById').resolves({ _id: roleId });
            const userUpdateStub = sinon.stub(User, 'updateMany').resolves({ nModified: 1 });
            const deleteStub = sinon.stub(Role, 'deleteOne').resolves({ deletedCount: 1 });

            const result = await RoleService.deleteRole(roleId);

            expect(roleStub.calledOnce).to.be.true;
            expect(userUpdateStub.calledOnce).to.be.true;
            expect(deleteStub.calledOnce).to.be.true;
            expect(result.message).to.equal('Role deleted successfully');
        });

        it('should throw an error if the role is not found', async () => {
            const roleId = new mongoose.Types.ObjectId();
            sinon.stub(Role, 'findById').resolves(null);

            try {
                await RoleService.deleteRole(roleId);
            } catch (error) {
                expect(error.message).to.equal('Role not found');
            }
        });
    });

    describe('createRoles', () => {
        it('should create roles and return them', async () => {
            const rolesArray = ['admin', 'user'];
            sinon.stub(Role, 'findOne').resolves(null); // No role found
            const saveStub = sinon.stub(Role.prototype, 'save').resolvesThis();

            const createdRoles = await RoleService.createRoles(rolesArray);

            expect(saveStub.calledTwice).to.be.true;
            expect(createdRoles).to.have.lengthOf(2);
        });

        it('should not create duplicate roles', async () => {
            const rolesArray = ['admin'];
            sinon.stub(Role, 'findOne').resolves({ name: 'admin' });

            const createdRoles = await RoleService.createRoles(rolesArray);

            expect(createdRoles).to.have.lengthOf(1);
            expect(createdRoles[0].name).to.equal('admin');
        });
    });
});
