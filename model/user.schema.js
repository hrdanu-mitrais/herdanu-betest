const mongoose = require('mongoose');

const redisUtil = require('../utils/redis.util')
const loggerUtil = require('../utils/logger.util')

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: String,
  accountNumber: {
    type: String,
    index: true,
    unique: true
  },
  emailAddress: String,
  identityNumber: {
    type: String,
    index: true,
    unique: true
  }
}, {
  timestamps: true,
  statics: {
    async getUsersFromDb() {
      try {
        const data = await this.find({})
        redisUtil.setKey('users', data)

        return data
      } catch (error) {
        loggerUtil.error(`Error retrieving users. Error: ${error}`);
        return null
      }
    },

    async getUsers() {
      try {
        let data = await redisUtil.getKey('users')
        if (!data) {
          data = this.getUsersFromDb()
          return data;
        }

        return JSON.parse(data)
      } catch (error) {
        loggerUtil.error(`Error retrieving users. Error: ${error}`);
        return null
      }
    },

    async getUserByAllowedKey(filterQuery) {
      const validKey = ['accountNumber', 'identityNumber']
      const keyExist = validKey.some(data => data in filterQuery)
      if (!keyExist) {
        return []
      }

      try {
        const data = await this.find(filterQuery)
        return data
      } catch (error) {
        loggerUtil.error(`Error retrieving user. Error: ${error}`);
        return null
      }
    },

    async createNewUser(payload) {
      try {
        const newUser = await this.create({ ...payload })
        await redisUtil.deleteKey('users')

        return newUser
      } catch (error) {
        loggerUtil.error(`Error creating new user. Error: ${error}`);
        return null
      }
    },

    async deleteUser(userId) {
      try {
        const deletedUser = await this.deleteOne({ _id: userId })
        await redisUtil.deleteKey('users')

        return deletedUser.deletedCount
      } catch (error) {
        loggerUtil.error(`Error creating new user. Error: ${error}`);
        return null
      }
    },

    async updateUser(userId, payload) {
      try {
        const updatedUser = await this.findByIdAndUpdate({ _id: userId }, payload)
        await redisUtil.deleteKey('users')

        return updatedUser
      } catch (error) {
        loggerUtil.error(`Error creating new user. Error: ${error}`);
        return null
      }
    },

    async getUniqueUserWithDifferentId(uniqueData) {
      let filter = {
        $or: [
          { accountNumber: uniqueData.accountNumber },
          { identityNumber: uniqueData.identityNumber }
        ],
      }

      if ('userId' in uniqueData) {
        filter = {
          ...filter,
          _id: {
            $nin: [uniqueData.userId]
          }
        }
      }

      try {
        const data = await this.find(filter)
        return data
      } catch (error) {
        loggerUtil.error(`Error retrieving unique user. Error: ${error}`);
        return null
      }
    },
  }
});


const User = model('User', userSchema);
module.exports = User;