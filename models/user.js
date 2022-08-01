const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    //   validator(v) {
    //     return validator.isUrl(v);
    //   },
    // },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator(v) {
    //     return validator.isEmail(v);
    //   },
    // },
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
        return Promise.reject(new Error('Пользователя не существует')); // 403 ошибка
      }
      return bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return Promise.reject(new Error(err.message)); // 401 err 'Неправильные почта или пароль'
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
