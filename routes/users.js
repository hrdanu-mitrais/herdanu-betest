const express = require('express');
const usersRouter = express.Router();

const {
  getUser,
  getUserByFilter,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/users')

const jwtUtil = require('../utils/jwt.util')

usersRouter.get('/', jwtUtil.authenticateTokenMiddleware, getUser);
usersRouter.get('/searchBy', jwtUtil.authenticateTokenMiddleware, getUserByFilter);
usersRouter.post('/', jwtUtil.authenticateTokenMiddleware, addUser);
usersRouter.delete('/:userId', jwtUtil.authenticateTokenMiddleware, deleteUser);
usersRouter.put('/:userId', jwtUtil.authenticateTokenMiddleware, updateUser);


module.exports = usersRouter;
