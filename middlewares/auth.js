const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Требуется авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
