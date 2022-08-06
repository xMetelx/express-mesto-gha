require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV,
  serverDb: process.env.SERVER_DB,
  jwtSecret: process.env.JWT_SECRET,
};
