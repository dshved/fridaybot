const request = require('request');
const { random } = require('lodash');
const framesMario = require('./frames');

function updateMessage(ts, channelId, frames) {
  const arr = [];

  for (let i = 1; i < frames.length; i++) {
    const text = encodeURI(frames[i]);
    const updateMessageUrl = `https://slack.com/api/chat.update?token=${global.BOT_TOKEN}&channel=${channelId}&text=${text}&ts=${ts}&as_user=fridaybot&pretty=1`;
    arr.push(() => {
      setTimeout(() => {
        request({ url: updateMessageUrl }, () => {});
      }, 300 * i);
    });
  }
  arr.forEach(item => item());
}

function startDraw(text, callback, msg, data) {
  const randomStory = random(0, framesMario.length - 1);
  const frames = framesMario[randomStory];
  const channelId = data.channel;
  const message = encodeURI(frames[0]);

  request(
    {
      url: `https://slack.com/api/chat.postMessage?token=${global.BOT_TOKEN}&channel=${channelId}&text=${message}&as_user=fridaybot&pretty=1`,
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
  drawMario: (text, callback, msg, data) => {
    startDraw(text, callback, msg, data);
  },
};
