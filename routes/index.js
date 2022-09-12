const express = require('express');
const router = express.Router();

const jwtUtil = require('../utils/jwt.util')
const httpRespStatusUtil = require('../utils/httpRespone.util')

router.get('/', jwtUtil.authenticateTokenMiddleware, function (req, res) {
  return httpRespStatusUtil.sendOk(res, 'herdanu_mitrais - btpn coding test 2022');
});

module.exports = router;
