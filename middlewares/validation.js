const { celebrate, Joi } = require('celebrate');
const pattern = ""

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().email().required().messages({
      'string.empty': 'Проверьте email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Проверьте пароль',
    }),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const profileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// ^( http|https):\/\/(www\.)?([a-z0-9\._])+([\w+\-\-._~:/?#\[\]!$&’()*+,;=-])+(#?)    добавить

const avatarValidation = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/^( http|https):\/\/(www\.)?([a-z0-9\._])+([\w+\-\-._~:/?#\[\]!$&’()*+,;=-])+(#?)/),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  userValidation,
  profileValidation,
  avatarValidation,
  cardValidation,
  userIdValidation,
  cardIdValidation,
};
