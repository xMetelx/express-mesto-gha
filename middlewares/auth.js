const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  console.log(authorization)

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    res.status(401).send({ message: 'Требуется авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
