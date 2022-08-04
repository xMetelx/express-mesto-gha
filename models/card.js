const mongoose = require('mongoose');

// eslint-disable-next-line no-useless-escape
const regex = new RegExp(/^( http|https):\/\/(www\.)?([a-z0-9\._])+([\w+\-\-._~:/?#\[\]!$&’()*+,;=-])+(#?)/);

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => regex.test(link),
    },
    message: 'Передайте ссылку',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
