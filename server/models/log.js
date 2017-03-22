const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const log = new Schema({
  user: {
    type: String,
  },
  command: {
    type: String,
  },
  date: {
    type: String,
  },
});

const Log = mongoose.model('Log', log);

module.exports = {
  Log,
};
