const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' })); // Ошибка сервера
};

module.exports.getUserById = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при запросе пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Email или пароль не переданы' });
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

//   "data": {
//     "name": "kiis",
//     "about": "test",
//     "avatar": "kxfhgvdfhjv.jpg",
//     "_id": "62e835d7e93ea406acbfe54d",
//     "password": "$2b$10$g3V.Ma8BRKBoQEvFq5PavOyiClm..Wz5oMrMRHZ6cv/aD6jY64ZpO",
//     "email": "1777@YA.RU"
// }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: 'Пользователь с такими данными уже существует' });
      }
      User.create({ ...req.body, password: hash })
        .then((newUser) => res.status(201).send({ data: newUser }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные при регистрации пользователя' });
            return;
          }
          res.status(500).send({ message: 'Ошибка по умолчанию' });
        });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);

      // res.send(user)

      const token = jwt.sign({ _id: req.user._id }, 'secret', { expiresIn: 604800 });
      res.status(200).send({ token, message: 'Аутентификация прошла успешно' });
    })
    .catch((err) => { //дописать ошибку 401!!!
      if (err.name === 'ValidationError') {
        res.status(401).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.patchProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
