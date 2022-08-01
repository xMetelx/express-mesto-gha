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
  const { name, about, avatar, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email или пароль не переданы' });
    };

    const hash = bcrypt.hash(req.body.password, 10);

    User.findOne({email})
      .then((user) => {
        if (user) {
          return res.status(409).send({ message: 'Пользователь с такими данными уже существует'});
        }
        User.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar, email: req.body.email, password: hash })
          .then((user) => { res.status(201).send({ data: user }); 
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
              return;
            }
            res.status(500).send({ message: 'Ошибка по умолчанию' });
          });
      }) 
      .catch(() => res.status(500).send({ message: "Ошибка по умолчанию"})); 
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res.status(403).send({ message: 'Пользователь не зарегистрирован' });
        return;
      }
      const token = jwt.sign({ _id: req.user._id }, 'secret', { expiresIn: 604800 } )
      res.send({ token });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
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
