const request = require('supertest')
const { expect } = require('chai')
const sinon = require('sinon')
const IoRedis = require('ioredis')

const app = require('../../app')
const User = require('../../model/user.schema');
const loggerUtil = require('../../utils/logger.util')
const jwtUtil = require('../../utils/jwt.util')

const sandbox = sinon.createSandbox()

describe('User Routes', function () {
  const userId = '631e9aa9d4831535a9d6e9ba'
  let accessToken
  let redis

  function reset() {
    sandbox.stub(loggerUtil, 'error')
    sandbox.stub(loggerUtil, 'debug')
    sandbox.stub(loggerUtil, 'info')
    sandbox.stub(loggerUtil, 'http')

    accessToken = jwtUtil.generateAccessToken({ test: 'purpose' });

    redis = sandbox
      .stub(IoRedis.prototype, "connect")
      .returns(Promise.resolve());
  }

  function restore() {
    redis.restore()
    sandbox.restore()
  }

  describe('GET /api/users', () => {
    beforeEach(reset)
    afterEach(restore)

    it('responds 401 unauthorized', async function () {
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Please check your request and try again');
    });

    it('responds 403 unauthorized', async function () {
      const res = await request(app).get('/api/users').auth(null, { type: 'bearer' });
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Token invalid');
    });

    it('responds users data', async function () {
      const users = [{ _id: 1 }]
      sandbox.stub(User, 'getUsers').returns(users)
      const res = await request(app).get('/api/users').auth(accessToken, { type: 'bearer' });
      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.equal(1);
    });
  })

  describe('GET /api/users/searchBy', () => {
    beforeEach(reset)
    afterEach(restore)

    it('responds 401 unauthorized', async function () {
      const res = await request(app).get('/api/users/searchBy');
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Please check your request and try again');
    });

    it('responds 403 unauthorized', async function () {
      const res = await request(app).get('/api/users/searchBy').auth(null, { type: 'bearer' });
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Token invalid');
    });

    it('responds specific user data', async function () {
      const users = [{ _id: 1 }]
      sandbox.stub(User, 'getUserByAllowedKey').returns(users)
      const res = await request(app).get('/api/users/searchBy').auth(accessToken, { type: 'bearer' });
      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.equal(1);
    });
  })

  describe('POST /api/users', () => {
    beforeEach(reset)
    afterEach(restore)

    it('responds 401 unauthorized', async function () {
      const res = await request(app).post('/api/users');
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Please check your request and try again');
    });

    it('responds 403 unauthorized', async function () {
      const res = await request(app).post('/api/users').auth(null, { type: 'bearer' });
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Token invalid');
    });

    it('responds new user data', async function () {
      const user = { _id: 1 }
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns(null)
      sandbox.stub(User, 'createNewUser').returns(user)
      const res = await request(app).post('/api/users').auth(accessToken, { type: 'bearer' }).send({ name: "name" });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'New user created');
    });
  })

  describe('DELETE /api/users/:userId', () => {
    beforeEach(reset)
    afterEach(restore)

    it('responds 401 unauthorized', async function () {
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Please check your request and try again');
    });

    it('responds 403 unauthorized', async function () {
      const res = await request(app).delete(`/api/users/${userId}`).auth(null, { type: 'bearer' });
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Token invalid');
    });

    it('responds with successfull deleted data message', async function () {
      sandbox.stub(User, 'deleteUser').returns(1)

      const res = await request(app).delete(`/api/users/${userId}`).auth(accessToken, { type: 'bearer' });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User deleted');
    });
  })

  describe('PUT /api/users/:userId', () => {
    beforeEach(reset)
    afterEach(restore)

    it('responds 401 unauthorized', async function () {
      const res = await request(app).put(`/api/users/${userId}`);
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Please check your request and try again');
    });

    it('responds 403 unauthorized', async function () {
      const res = await request(app).put(`/api/users/${userId}`).auth(null, { type: 'bearer' });
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Token invalid');
    });

    it('responds with successfull updated data message', async function () {
      sandbox.stub(User, 'getUniqueUserWithDifferentId').returns(null)
      sandbox.stub(User, 'updateUser').returns(1)
      const res = await request(app).put(`/api/users/${userId}`).auth(accessToken, { type: 'bearer' });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User updated');
    });
  })
});
