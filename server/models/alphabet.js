const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alphabet = new Schema({
  letter: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const Alphabet = mongoose.model('Alphabet', alphabet);

module.exports = {
  Alphabet,
};
