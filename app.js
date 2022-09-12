require('dotenv').config()

const express = require('express');
const cors = require('cors');

const redisUtil = require('./utils/redis.util')
const loggerUtil = require('./utils/logger.util')
const morganMiddleware = require("./middlewares/morgan.middleware");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tokenRouter = require('./routes/token');

const app = express();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

redisUtil.redisConn().on('connect', () => {
  loggerUtil.info('Redis connected')
})

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', tokenRouter);

module.exports = app;
