
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { auth } = req.headers;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }

  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (err) {
      res.status(401).send({ message: 'Требуется авторизация' });
      return;
  }

  req.user = payload;
  next();
};