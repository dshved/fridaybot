const request = require('request');
const Sticker = require('./../../models/sticker').Sticker;

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function getSticker(data, callback) {
  Sticker.find({ emoji: data.text.toUpperCase() }).then(result => {
    if (result.length) {
      request(
        {
          url: `https://slack.com/api/users.info?token=${global.BOT_TOKEN}&user=${data.user}&pretty=1`,
          encoding: null,
        },
        (err, res, body) => {
          const json = JSON.parse(body);
          if (json.ok) {
            const randomEmoji = randomInteger(0, result.length - 1);
            const attachment = {};
            const domainURL = 'http://fridaybot.tk';
            attachment.username = json.user.profile.display_name;
            attachment.icon_url = json.user.profile.image_72;
            attachment.attachments = [
              {
                fallback: '',
                image_url: `${domainURL}${result[randomEmoji].image_url}`,
              },
            ];
            callback(attachment);
          }
        },
      );
    }
  });
}

module.exports = {
  getSticker,
};
