const express = require('express');

const cardRouter = express.Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  cardValidation,
  cardIdValidation,
} = require('../middlewares/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidation, createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', cardIdValidation, likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
