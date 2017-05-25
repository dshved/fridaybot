const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sticker = new Schema({
  emoji: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});

const Sticker = mongoose.model('Sticker', sticker);

module.exports = {
  Sticker,
};
