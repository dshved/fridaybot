const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statistics = new Schema({
  event_type: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  parrot_count: {
    type: Number,
  }
});

const Statistics = mongoose.model('Statistics', statistics);

module.exports = {
  Statistics,
};
