const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const botMessages = new Schema({
  user_message: {
    type: String,
    required: true,
  },
  bot_message: {
    type: String,
    required: true,
  },
  last_edited: {
    type: String,
  },
});

const BotMessages = mongoose.model('BotMessages', botMessages);

module.exports = {
  BotMessages,
};
