const { ObjectId } = require('mongodb');

const httpRespStatusUtil = require('../utils/httpRespone.util')
const loggerUtil = require('../utils/logger.util')
const User = require('../model/user.schema');

function userControllers() {
  async function getUser(req, res) {
    const data = await User.getUsers(req.query);
    if (!data) {
      loggerUtil.error(`Failed to retrieve users`);
      return httpRespStatusUtil.sendBadRequest(res, 'Failed to retrieve users');
    }

    loggerUtil.info(`Users retrieved`);
    return httpRespStatusUtil.sendOk(res, { data })
  }

  async function getUserByFilter(req, res) {
    const data = await User.getUserByAllowedKey(req.query);
    if (!data) {
      loggerUtil.error(`Failed to retrieve user`);
      return httpRespStatusUtil.sendBadRequest(res, 'Failed to retrieve user');
    }

    loggerUtil.info(`User retrieved`);
    return httpRespStatusUtil.sendOk(res, { data })
  }

  async function addUser(req, res) {
    const uniqueUser = await User.getUniqueUserWithDifferentId({
      accountNumber: req.body.accountNumber,
      identityNumber: req.body.identityNumber
    });
    if (uniqueUser && uniqueUser.length) {
      return httpRespStatusUtil.sendBadRequest(res, 'User exist');
    }

    const newUser = await User.createNewUser(req.body)
    if (!newUser) {
      return httpRespStatusUtil.sendBadRequest(res, 'Failed to create new user');
    }

    loggerUtil.info(`Added a new user with id ${newUser._id}`);
    return httpRespStatusUtil.sendCreatedOk(res, 'New user created');
  }

  async function deleteUser(req, res) {
    const deleteUser = await User.deleteUser(ObjectId(req.params.userId))
    if (!deleteUser) {
      return httpRespStatusUtil.sendBadRequest(res, 'Failed to delete user');
    }

    loggerUtil.info(`1 document deleted`);
    return httpRespStatusUtil.sendCreatedOk(res, 'User deleted');
  }

  async function updateUser(req, res) {
    const uniqueUser = await User.getUniqueUserWithDifferentId({
      accountNumber: req.body.accountNumber,
      identityNumber: req.body.identityNumber,
      userId: req.params.userId,
    });
    if (uniqueUser && uniqueUser.length) {
      return httpRespStatusUtil.sendBadRequest(res, 'User exist');
    }

    const updatedUser = await User.updateUser(ObjectId(req.params.userId), { ...req.body })
    if (!updatedUser) {
      return httpRespStatusUtil.sendBadRequest(res, 'Failed to update user');
    }

    loggerUtil.info(`1 document updated`);
    return httpRespStatusUtil.sendCreatedOk(res, 'User updated');
  }

  return {
    getUser,
    getUserByFilter,
    addUser,
    deleteUser,
    updateUser
  }
}

module.exports = userControllers()