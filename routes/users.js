const express = require('express');
const {
  getUsers, getUserById, createUser, patchProfile, patchAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', patchProfile);
userRouter.patch('/me/avatar', patchAvatar);

module.exports = userRouter;
