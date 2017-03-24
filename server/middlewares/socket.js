
const BotSettings = require('../models/botsetting').BotSettings;

io.on('connection', () => {

  BotSettings.findOne().then((result) => {
    if (result) {
      io.emit('parrot count', result.parrot_counts);
    }
  });
})

module.exports = io;
