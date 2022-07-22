const express = require('express');
const {
  getUsers, getUserById, createUser, patchProfile, patchAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', express.json(), createUser);
userRouter.patch('/me', express.json(), patchProfile);
userRouter.patch('/me/avatar', express.json(), patchAvatar);

module.exports = userRouter;
