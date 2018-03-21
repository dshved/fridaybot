const request = require('request');
const { rightGooseFrames, leftGooseFrames } = require('./frames');

function updateMessage(ts, channelId, frames) {
  const arr = [];

  for (let i = 1; i < 17; i++) {
    const text = encodeURI(frames[i]);
    const updateMessageUrl = `https://slack.com/api/chat.update?token=${
      global.BOT_TOKEN
    }&channel=${channelId}&text=${text}&ts=${ts}&as_user=fridaybot&pretty=1`;
    arr.push(() => {
      setTimeout(() => {
        request({ url: updateMessageUrl }, () => {});
      }, 300 * i);
    });
  }
  arr.forEach(item => item());
}

function startGoose(channelId, direction) {
  const frames = direction ? rightGooseFrames : leftGooseFrames;
  const text = encodeURI(frames[0]);

  request(
    {
      url: `https://slack.com/api/chat.postMessage?token=${
        global.BOT_TOKEN
      }&channel=${channelId}&text=${text}&as_user=fridaybot&pretty=1`,
      encoding: null,
    },
    (err, res, body) => {
      const json = JSON.parse(body);
      if (json.ok) {
        updateMessage(json.ts, channelId, frames);
      }
    },
  );
}

module.exports = {
  goose: (channelId, direction) => {
    startGoose(channelId, direction);
  },
};
