const IoRedis = require('ioredis');

const loggerUtil = require('./logger.util')


function redisUtil() {
  function redisConn() {
    const redis = new IoRedis({
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
    })

    return redis
  }
  async function setKey(key, payload) {
    loggerUtil.debug(`Set redis for key: ${key}`)
    const redis = redisConn()
    return redis.set(key, JSON.stringify(payload));
  }

  async function getKey(key) {
    const redis = redisConn()

    return redis.get(key).then(function (result) {
      if (result) {
        loggerUtil.debug(`Data from redis key: ${key} retrieved`)
      }

      return result
    }).catch(err => {
      loggerUtil.error(`Error retrieving key from Redis. Error:${err}`);
      return null;
    });
  }

  async function deleteKey(key) {
    loggerUtil.debug(`Delete redis with key: ${key}`)

    const redis = redisConn()

    return redis.del(key);
  }

  return {
    setKey,
    getKey,
    deleteKey,
    redisConn
  }
}

module.exports = redisUtil()
