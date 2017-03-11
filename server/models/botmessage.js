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
});

const BotMessages = mongoose.model('BotMessages', botMessages);

module.exports = {
  BotMessages,
};
