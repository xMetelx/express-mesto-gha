const { celebrate, Joy } = require('celebrate');

//дописать проверку ссылок

const userValidation = celebrate ({
  body: Joy.object.keys({
    name: Joy.string().required(false).min(2).max(30),
    about: Joy.string().required(false).min(2).max(30),
    avatar: Joy.string().required(false),
    email: Joy.string().required().email(),
    password: Joy.string().required()
  })
})

const profileValidation = celebrate({
  body: Joy.object.keys({
    name: Joy.string().required(false).min(2).max(30),
    about: Joy.string().required(false).min(2).max(30)
  })
})

const avatarValidation = celebrate({
  body: Joy.object.keys({
    avatar: Joy.string().required(false)
  })
})

const cardValidation = celebrate({
  body: Joy.object().keys({
    name: Joy.string().required().min(2).max(30),
    link: Joy.string().required()
  })
})

module.exports = {
  userValidation,
  profileValidation,
  avatarValidation,
  cardValidation
}