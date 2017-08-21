'use strict';

const Sticker = require('./../../models/sticker').Sticker;

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function getSticker(emoji, callback) {
  Sticker.find({ emoji: emoji }).then(result => {
    if (result.length) {
      const randomEmoji = randomInteger(0, result.length - 1);
      const attachment = {};
      const domainURL = 'http://fridaybot.tk';
      attachment.username = 'fridaybot';
      attachment.icon_emoji = ':fbf:';
      attachment.attachments = [
        {
          fallback: '',
          image_url: `${domainURL}${result[randomEmoji].image_url}`,
        },
      ];
      callback(attachment);
    }
  });
}

module.exports = {
  getSticker,
};
