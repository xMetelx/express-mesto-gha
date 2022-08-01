const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' })); // Ошибка сервера
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => { res.status(201).send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }); // Ошибка сервера
};

module.exports.deleteCard = (req, res) => Card.findById(req.params.cardId)
  .then((card) => {

    if (req.user._id !== card.owner._id) {
      res.status(400).send({ message: 'Чужие карточки удалять запрещено' });
      return;
    }

    Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(200).send({ card,  message: 'Ваша карточка успешно удалена' });
    })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      return;
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' });
  });

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  { _id: req.params.cardId },
  { $addToSet: { likes: { cardId: req.user._id } } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      return;
    }
    res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      return;
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  { _id: req.params.cardId },
  { $pull: { likes: { cardId: req.user._id } } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      return;
    }
    res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      return;
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' });
  });
