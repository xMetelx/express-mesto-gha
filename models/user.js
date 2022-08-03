const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const isEmail = require('validator/lib/isEmail');

const UnauthorizedError = require('../utils/errors/UnauthorizedError');

// eslint-disable-next-line no-useless-escape
// const regex = new RegExp('^( http|https):\/\/(www\.)?([a-z0-9\._])+([\w+\-\-._~:/?#\[\]!$&’()*+,;=-])+(#?)');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // validate: {
    //   validator: (avatar) => regex.test(avatar),
    // },
    message: 'Передайте ссылку',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return isEmail(email);
      },
      message: 'Передайте электронную почту',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Пользователя не существует'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Переданы некорректные данные (логин или пароль)'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
