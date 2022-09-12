const request = require('supertest')
const { expect } = require('chai')
const sinon = require("sinon");

const app = require('../../app')
const jwtUtil = require('../../utils/jwt.util')
const loggerUtil = require('../../utils/logger.util')

const sandbox = sinon.createSandbox();

describe('GET /auth/token', function () {
  before(() => {
    sandbox.stub(loggerUtil, 'error')
    sandbox.stub(loggerUtil, 'debug')
    sandbox.stub(loggerUtil, 'info')
    sandbox.stub(loggerUtil, 'http')
  })

  after(() => {
    sandbox.restore()
  })

  it('responds token', async function () {
    sandbox.stub(jwtUtil, 'generateAccessToken').returns('valid.token')
    const res = await request(app).get('/api/auth/token')
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('accessToken', 'valid.token');
  });
});
