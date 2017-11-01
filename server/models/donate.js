const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const donate = new Schema({
  user: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: false,
  },
});

const Donate = mongoose.model('Donate', donate);

module.exports = Donate;
