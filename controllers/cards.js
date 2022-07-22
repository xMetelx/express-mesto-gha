const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards) {
        res.status(400).send('Переданы некорректные данные при создании карточки');
        return;
      }
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send('Ошибка по умолчанию')); // Ошибка сервера
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      // if (!card) {
      //   res.status(400).send('Переданы некорректные данные при создании карточки');
      //   return;
      // }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send(err.message)); // Ошибка сервера
};

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(
  req.params.cardId,
  (err) => {
    if (err) {
      res.status(404).send('Карточка с указанным _id не найдена');
    }
  },
)
  .then((card) => res.status(200).send(card))
  .catch(() => res.status(500).send('Ошибка по умолчанию'));

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  { _id: req.params.cardId },
  { $addToSet: { likes: { cardId: req.user._id } } }, // добавить _id в массив, если его там нет
  { new: true },
  (err) => {
    if (err) {
      res.status(404).send('Карточка с указанным _id не найдена');
    }
  },
)
  .then((card) => {
    res.status(200).send(card);
  })
  .catch(() => res.status(500).send('Ошибка по умолчанию1'));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: { cardId: req.user._id } } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    res.status(200).send(card);
  })
  .catch(() => res.status(500).send('Ошибка по умолчанию'));
