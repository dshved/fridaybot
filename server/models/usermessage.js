const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userMessages = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_full_name: {
    type: String,
    required: false,
  },
  count_messages: {
    type: Number,
    required: true,
  },
});

const UserMessages = mongoose.model('UserMessages', userMessages);

module.exports = {
  UserMessages,
};
