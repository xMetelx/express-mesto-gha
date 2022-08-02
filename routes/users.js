const express = require('express');

const {
  getUsers,
  getUserById,
  patchProfile,
  patchAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

const {
  userValidation,
  profileValidation,
  avatarValidation,
} = require('../middlewares/validation');

userRouter.get('/', userValidation, getUsers);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', profileValidation, patchProfile);
userRouter.patch('/me/avatar', avatarValidation, patchAvatar);

module.exports = userRouter;
