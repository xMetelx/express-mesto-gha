const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(200).send(users);
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при запросе пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }); // Ошибка сервера
};

module.exports.createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.patchProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  console.log(userId);
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя'})
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    });
};

module.exports.patchAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(200).send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя'})
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    });
};
