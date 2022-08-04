const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError'); //  404
const BadRequestError = require('../utils/errors/BadRequestError'); //  400
const ConflictError = require('../utils/errors/ConflictError'); // 409

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при запросе пользователя'));
      }
      next(err);
    });
};

module.exports.getMyProfile = (req, res, next) => {
  console.log(123)
  User.findOne(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => res.send(err.message));
}

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не переданы');
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с такими данными уже существует');
      }
      User.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar, email: req.body.email, password: hash })
        .then((newUser) => res.status(201).send({ 
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
          email: newUser.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при регистрации пользователя'));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: 604800 });
      res.status(200).send({ token, message: 'Аутентификация прошла успешно' });
    })
    .catch(next);
};

module.exports.patchProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next (new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next (new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      next(err);
    });
};
