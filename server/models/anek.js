const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const anek = new Schema({
  id: {
    type: Number,
  },
  cat: {
    type: Number,
  },
  text: {
    type: String,
  },
});

const Anek = mongoose.model('Anek', anek);

module.exports = {
  Anek,
};
