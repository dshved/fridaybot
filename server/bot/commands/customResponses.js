const request = require('request');
const BotMessages = require('./../../models/botmessage').BotMessages;

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function getCustomResponses(data, callback) {
  BotMessages.find({ user_message: data.text.toUpperCase() }).then(result => {
    if (result.length) {
      request(
        {
          url: `https://slack.com/api/users.info?token=${global.BOT_TOKEN}&user=${data.user}&pretty=1`,
          encoding: null,
        },
        (err, res, body) => {
          const json = JSON.parse(body);
          if (json.ok) {
            const randomResponse = randomInteger(0, result.length - 1);
            const message = result[randomResponse].bot_message;
            const attachment = {};
            attachment.username = 'fridaybot';
            attachment.icon_emoji = ':fridaybot_new:';
            attachment.text = message;
            callback(attachment);
          }
        },
      );
    }
  });
}

module.exports = {
  getCustomResponses,
};
