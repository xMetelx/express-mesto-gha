const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(400).send('Переданы некорректные данные при создании пользователя');
        return;
      }
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send('Ошибка по умолчанию')); // Ошибка сервера
};

module.exports.getUserById = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!id) {
        res.status(404).send('Пользователь по указанному _id не найден');
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(500).send('Ошибка по умолчанию')); // Ошибка сервера
};

module.exports.createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => {
      if (!user) {
        res.status(400).send('Переданы некорректные данные при создании пользователя');
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(500).send('Ошибка по умолчанию'));
};

module.exports.patchProfile = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id }, // добавить ошибку 404 — Пользователь с указанным _id не найден.
    {
      name: req.body.name,
      about: req.body.about,
    },
    (err) => {
      if (err) {
        res.status(404).send('Пользователь с указанным _id не найден');
      }
    },
  )
    .then((user) => {
      if (!user) {
        res.status(400).send('Переданы некорректные данные при обновлении профиля');
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(500).send('Ошибка по умолчанию'));
};

module.exports.patchAvatar = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id }, // добавить ошибку 404 — Пользователь с указанным _id не найден.
    { avatar: req.body.avatar },
  )
    .then((user) => {
      if (!user) {
        res.status(400).send('Переданы некорректные данные при обновлении аватара');
        return;
      }
      res.status(200).send({ avatar: user.avatar });
    })
    .catch(() => res.status(500).send('Ошибка по умолчанию'));
};
