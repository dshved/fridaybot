const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const police = new Schema({
  image_id: {
    type: String,
  },
  image_url: {
    type: String,
  },
});

const Police = mongoose.model('Police', police);

module.exports = {
  Police,
};
