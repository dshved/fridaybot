'use strict';

const Sticker = require('./../../models/sticker').Sticker;

function getSticker(emoji, callback) {
  Sticker.findOne({ emoji: emoji }).then(result => {
    if (result) {
      const attachment = {};
      const domainURL = 'http://fridaybot.tk';
      attachment.username = 'fridaybot';
      attachment.icon_emoji = ':fbf:';
      attachment.attachments = [{
        fallback: '',
        image_url: `${domainURL}${result.image_url}`,
      }, ];
      callback(attachment);
    }
  });
}

module.exports = {
  getSticker,
}
