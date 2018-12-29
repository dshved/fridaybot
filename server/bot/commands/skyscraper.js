const request = require('request');
const { getRandomEmoji } = require('./say');

function startDraw(text, callback, msg, data) {
  let count = parseInt(text, 10);
  if (!isNaN(count)) {
    if (count > 100) {
      count = 100;
    }
    const channelId = data.channel;
    for (let i = 0; i < count; i++) {
      let message = encodeURI(
        ':mariobrick::mariobrick::mariobrick::mariobrick::mariobrick:\n:mariobrick::replace_1::mariobrick::replace_2::mariobrick:\n:mariobrick::mariobrick::mariobrick::mariobrick::mariobrick:\n',
      );
      getRandomEmoji(emoji => {
        message = message
          .replace('replace_1', emoji[0])
          .replace('replace_2', emoji[1]);
        request(
          {
            url: `https://slack.com/api/chat.postMessage?token=${global.BOT_TOKEN}&channel=${channelId}&text=${message}&as_user=fridaybot&pretty=1`,
            encoding: null,
          },
          (err, res, body) => {},
        );
      });
    }
  }
}

module.exports = {
  drawSkyscraper: (text, callback, msg, data) => {
    startDraw(text, callback, msg, data);
  },
};
