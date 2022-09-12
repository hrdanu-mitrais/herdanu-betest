const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const loggerUtil = require('../utils/logger.util')
const connectionString = process.env.ATLAS_URI;

module.exports = {
  connectToServer: async function () {
    return mongoose.connect(connectionString, {
      useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1
    }).then(() => {
      loggerUtil.info('MongoDB connected via mongoose');
      return 'Connected'
    }).catch(error => {
      loggerUtil.error(`Error connecting MongoDB via mongoose. Error:${error}`);
      return null
    })
  }
};
