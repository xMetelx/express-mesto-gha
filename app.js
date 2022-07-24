const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
// id - 62cf11fd4b739a15acf099c1
app.use((req, res, next) => {
  req.user = {
    _id: '62cf11fd4b739a15acf099c1',
  };
  next();
});

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.patch('/404', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемой страницы не существует' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('Mongo is ON'))
  .catch(() => console.log('Mongoose error'));

app.listen(PORT, () => {
  console.log(`Приложение запущено на ${PORT} порте`);
});
