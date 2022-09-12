const jwt = require('jsonwebtoken');

const httpRespStatusUtil = require('./httpRespone.util');
const loggerUtil = require('./logger.util');

function jwtUtil() {
  function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '15m' });
  }

  function authenticateTokenMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      loggerUtil.error('Token is not found')
      return httpRespStatusUtil.sendUnauthorized(res, 'Please check your request and try again')
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
      if (err) {
        loggerUtil.error('Token invalid')
        return httpRespStatusUtil.sendRequestFailed(res, 'Token invalid')
      }

      req.payload = payload

      next()
    })
  }

  return {
    generateAccessToken,
    authenticateTokenMiddleware
  }
}

module.exports = jwtUtil()
