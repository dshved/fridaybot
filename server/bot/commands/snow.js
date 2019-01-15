/* eslint-disable */
const request = require('request');
const { replaceTextEmoji } = require('./say');

let snow = `:snowflake:`;

class Gp {
  constructor() {
    this.pArea = [];
    this.playArea = new Array(8);
    this.back = `:sp:`;

    for (var i = 0; i < 8; i++) {
      this.playArea[i] = new Array(10);
    }
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 8; j++) {
        this.playArea[j][i] = this.back;
      }
    }
    this.pArea = this.playArea;
    return this;
  }

  move(area) {
    const snowline = [];
    for (var i = 0; i < 16; i++) {
      Math.random() * 10 > 8 ? snowline.push(snow) : snowline.push(this.back);
    }
    for (var i = 7; i > 0; i--) {
      area[i] = area[i - 1];
      area[i].splice(0, 0, area[i].splice(15, 1)[0]);
    }
    area[0] = snowline;

    return area;
  }

  go() {
    this.pArea = this.move(this.pArea);
    return [...this.pArea].map(e => e.join('')).join('\n');
  }
}

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
  text = text.toUpperCase();
  const obj = replaceTextEmoji(text);
  let exist = false;

  if (text === 'СНЕГ') {
    snow = `:snowflake:`;
    exist = true;
  }

  if (obj.countEmoji > 0) {
    snow = obj.emoji[0];
    exist = true;
  }
  const gmp = new Gp();
  if (exist) {
    const randomStory = [];
    for (let i = 0; i < 60; i++) {
      randomStory.push(gmp.go());
    }
    const frames = randomStory;
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
        } else {
        }
      },
    );
  }
}

module.exports = {
  drawSnow: (text, callback, msg, data) => {
    startDraw(text, callback, msg, data);
  },
  drawSnowReplace: (text, callback, msg, data) => {
    startDraw(text, callback, msg, data);
  },
};
/* eslint-enable */
