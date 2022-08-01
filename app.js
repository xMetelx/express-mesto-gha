const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  userValidation,
  profileValidation,
  avatarValidation,
  cardValidation,
} = require('./middlewares/validation');

console.log(process.env.NODE_ENV);

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('Mongo is ON'))
  .catch(() => console.log('Mongoose error'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser); // добавить валидацию - мидлвэр
app.post('/signin', login);

app.use('/cards', auth, cardValidation, cardRouter);
app.use('/users', auth, userRouter); //profileValidation, avatarValidation
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемой страницы не существует'));
});

app.use((err, req, res, next) => {

})





app.listen(PORT, () => {
  console.log(`Приложение запущено на ${PORT} порте`);
});
