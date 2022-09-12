const express = require('express');
const tokenRouter = express.Router();

const jwtUtil = require('../utils/jwt.util')
const httpRespStatusUtil = require('../utils/httpRespone.util')

/* GET home page. */
tokenRouter.get('/token', function (req, res) {
  const token = jwtUtil.generateAccessToken({ nothing: 'here' });
  return httpRespStatusUtil.sendOk(res, { accessToken: token });
});

module.exports = tokenRouter;
