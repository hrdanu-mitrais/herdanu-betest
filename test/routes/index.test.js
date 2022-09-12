const request = require('supertest')
const { expect } = require('chai')
const sinon = require('sinon')

const app = require('../../app')
const loggerUtil = require('../../utils/logger.util')
const jwtUtil = require('../../utils/jwt.util')

const sandbox = sinon.createSandbox()

describe('GET /api', function () {
  let accessToken

  beforeEach(() => {
    accessToken = jwtUtil.generateAccessToken({ test: 'purpose' });

    sandbox.stub(loggerUtil, 'error')
    sandbox.stub(loggerUtil, 'debug')
    sandbox.stub(loggerUtil, 'info')
    sandbox.stub(loggerUtil, 'http')
  });

  afterEach(() => {
    sandbox.restore()
  })

  it('responds 401 unauthorized', async function () {
    const res = await request(app).get('/api/');
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Please check your request and try again');
  });

  it('responds 403 unauthorized', async function () {
    const res = await request(app).get('/api/').auth(null, { type: 'bearer' });
    expect(res.status).to.equal(403);
    expect(res.body).to.have.property('message', 'Token invalid');
  });

  it('responds with successfull message when app connected', async function () {
    const res = await request(app).get('/api/').auth(accessToken, { type: 'bearer' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'herdanu_mitrais - btpn coding test 2022');
  });
});
