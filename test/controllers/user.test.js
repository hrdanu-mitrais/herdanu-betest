const { expect } = require('chai')
const sinon = require("sinon");
const IoRedis = require('ioredis')

const User = require('../../model/user.schema');
const loggerUtil = require('../../utils/logger.util')

const {
  getUser,
  getUserByFilter,
  addUser,
  deleteUser,
  updateUser
} = require('../../controllers/users');

const sandbox = sinon.createSandbox();

describe('UserController', function () {
  const userId = '631e9aa9d4831535a9d6e9ba'
  let res
  let req
  let redis

  function reset() {
    res = {
      statusCode: 200,
      send() { },
      status(responseStatus) {
        this.statusCode = responseStatus;
        return this;
      }
    };
    req = {
      body: {},
      query: {}
    }

    sandbox.stub(loggerUtil, 'error')
    sandbox.stub(loggerUtil, 'debug')
    sandbox.stub(loggerUtil, 'info')

    redis = sandbox
      .stub(IoRedis.prototype, "connect")
      .returns(Promise.resolve());
  }

  function restore() {
    redis.restore()
    sandbox.restore()
  }

  describe("getUser", () => {
    beforeEach(reset);
    afterEach(restore);

    it("should return error when failed to retrieve all users", async () => {
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUsers').returns(null)

      await getUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('Failed to retrieve users');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return all users", async () => {
      const users = [{ _id: 1 }]
      const sendSpy = sandbox.spy(res, 'send');

      sandbox.stub(User, 'getUsers').returns(users)

      await getUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.data).to.be.an('array').that.includes(users[0]);
      expect(sendResult.thisValue.statusCode).to.equal(200)
    });
  });

  describe("getUserByFilter", () => {
    beforeEach(reset);
    afterEach(restore);

    it("should return error when failed to retrieve user by filter", async () => {
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUserByAllowedKey').returns(null)

      await getUserByFilter(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('Failed to retrieve user');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return user by filter", async () => {
      const user = [{ _id: 1 }]
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUserByAllowedKey').returns(user)

      await getUserByFilter(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.data).to.be.an('array').that.includes(user[0]);
      expect(sendResult.thisValue.statusCode).to.equal(200)
    });
  });

  describe("addUser", () => {
    beforeEach(reset);
    afterEach(restore);

    it("should return error when user exist", async () => {
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns([1])

      await addUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('User exist');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return error when failed to add user", async () => {
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns(null)
      sandbox.stub(User, 'createNewUser').returns(null)

      await addUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('Failed to create new user');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return new user", async () => {
      const sendSpy = sandbox.spy(res, 'send');
      const successMessage = 'New user created'
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns(null)
      sandbox.stub(User, 'createNewUser').returns(successMessage)

      await addUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal(successMessage);
      expect(sendResult.thisValue.statusCode).to.equal(201)
    });
  });

  describe("deleteUser", () => {
    beforeEach(reset);
    afterEach(restore);

    it("should return error when user is not exist", async () => {
      req = {
        ...req,
        params: {
          userId
        }
      }
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'deleteUser').returns(null)

      await deleteUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('Failed to delete user');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return deleted user", async () => {
      req = {
        ...req,
        params: {
          userId
        }
      }
      const sendSpy = sandbox.spy(res, 'send');
      const successMessage = 'User deleted'
      sandbox.stub(User, 'deleteUser').returns(successMessage)

      await deleteUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal(successMessage);
      expect(sendResult.thisValue.statusCode).to.equal(201)
    });
  });

  describe("updateUser", () => {
    beforeEach(reset);
    afterEach(restore);

    it("should return error when user exist", async () => {
      req = {
        ...req,
        params: {
          userId
        }
      }
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns([1])

      await updateUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('User exist');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return error when failed to update user", async () => {
      req = {
        ...req,
        params: {
          userId
        }
      }
      const sendSpy = sandbox.spy(res, 'send');
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns(null)
      sandbox.stub(User, 'updateUser').returns(null)

      await updateUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal('Failed to update user');
      expect(sendResult.thisValue.statusCode).to.equal(400)
    });

    it("should return new user", async () => {
      req = {
        ...req,
        params: {
          userId
        }
      }
      const sendSpy = sandbox.spy(res, 'send');
      const successMessage = 'User updated'
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns(null)
      sandbox.stub(User, 'updateUser').returns(successMessage)

      await updateUser(req, res);

      const sendResult = sendSpy.getCall(0);

      expect(sendResult.firstArg.message).to.equal(successMessage);
      expect(sendResult.thisValue.statusCode).to.equal(201)
    });
  });
});