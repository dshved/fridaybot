const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const botSettings = new Schema({
  name: {
    type: String,
    default: 'fridaybot',
  },
  icon: {
    emoji: {
      type: String,
      default: ':fridaybot:',
    },
    url: {
      type: String,
      default: '',
    },
  },
  parrot_array: {
    type: Array,
    default: ['parrot', ':fp:', ':tp:', ':lapanoid:', ':lp:'],
  },
  parrot_counts: {
    type: Number,
    default: 0,
  },
  channel_name: {
    type: String,
    default: 'test',
  },
  channel_id: {
    type: String,
  },
  commands: {
    type: Array,
    defautl: [{
      command_name: 'есть кто живой?',
      commant_id: 0,
    }],
  },
  user_join: {
    active: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: 'Привет',
    },
  },
  user_leave: {
    active: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: 'Пока',
    },
  },

});


const BotSettings = mongoose.model('BotSettings', botSettings);

module.exports = {
  BotSettings,
};
