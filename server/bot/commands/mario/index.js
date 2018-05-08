const request = require('request');
const { replaceTextEmoji } = require('../say');

const fire = ':flames:';
const back = ':black:';
const brick = ':mariobrick:';
let mario = ':mario:';
const superMario = ':mario_run:';
const monster = ':mario_monster:';
const shroom = ':powerup:';

const playArea = new Array(8);

const player = {
  isSuper: false,
  x: 4,
  y: 5,
  jumped: false,
};

const pShroom = {
  x: 1,
  y: 5,
  onMap: false,
};
let pArea = [];

class Gp {
  constructor() {
    for (let i = 0; i < 8; i++) {
      playArea[i] = new Array(10);
    }
    for (let i = 0; i < 16; i++) {
      playArea[0][i] = back;
      playArea[1][i] = back;
      playArea[2][i] = back;
      playArea[3][i] = back;
      playArea[4][i] = back;
      playArea[5][i] = brick;
      playArea[6][i] = back;
      playArea[7][i] = fire;
    }
    pArea = playArea;
    return this;
  }

  setShroom(area) {
    if (pShroom.onMap && !player.isSuper) {
      area[pShroom.x][pShroom.y] = shroom;
      if (area[pShroom.x + 1][pShroom.y] !== brick) {
        pShroom.x++;
        if (pShroom.x > 6) {
          pShroom.onMap = false;
          pShroom.x = 1;
        }
      }
    }
  }
  setPlayer(area) {
    if (area[player.x][player.y] === monster && !player.jumped) {
      area[player.x][player.y] = back;
    }
    if (player.x === pShroom.x && player.y === pShroom.y) {
      area[player.x][player.y] = back;
      pShroom.onMap = false;
      player.isSuper = true;
    }
    const newArea = area.map(arr => arr.slice());

    newArea[player.x][player.y] = player.isSuper ? superMario : mario;
    this.setShroom(newArea);
    if (player.jumped) {
      if (newArea[player.x - 1][player.y] === brick) {
        pShroom.onMap = true;
      }
      player.x++;
      player.jumped = false;
    }

    return newArea;
  }

  move(area, lf) {
    if (lf === 1) {
      for (let i = 0; i < 8; i++) {
        area[i].shift();
      }
      area[0].push(back);
      area[1].push(back);
      area[2].push(Math.random() >= 0.15 ? back : brick);
      area[3].push(back);
      area[5].push(Math.random() >= 0.8 ? back : brick);
      area[4].push(
        Math.random() >= 0.9 && playArea[5][15] === brick ? monster : back,
      );
      area[6].push(back);
      area[7].push(fire);
    } else {
      for (let i = 0; i < 8; i++) {
        area[i].pop();
      }
      area[0].unshift(back);
      area[1].unshift(back);
      area[2].unshift(Math.random() >= 0.15 ? back : brick);
      area[3].unshift(back);
      area[5].unshift(Math.random() >= 0.8 ? back : brick);
      area[4].unshift(
        Math.random() >= 0.9 && playArea[5][24] === brick ? monster : back,
      );

      area[6].unshift(back);
      area[7].unshift(fire);
    }
    return area;
  }

  jump(pl, area, lf = undefined) {
    // lf - 0 back 1 right undefined
    if (lf) {
      area = this.move(area, lf);
    }
    pl.x--;
    pl.jumped = true;
    return area;
  }

  go() {
    if (pArea[5][6] !== brick || pArea[4][7] === monster) {
      pArea = this.jump(player, pArea, 1);
    } else {
      pArea = this.move(pArea, 1);
    }
    return this.setPlayer(pArea)
      .map(e => e.join(''))
      .join('\n');
  }
}

const gmp = new Gp();

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
  if (text === 'МАРИО') {
    mario = ':mario:';
    exist = true;
  }

  if (obj.countEmoji > 0) {
    mario = obj.emoji[0];
    exist = true;
  }

  if (exist) {
    const randomStory = [];
    for (let i = 0; i < 40; i++) {
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
          // updateMessage(json.ts, channelId, frames);
        }
      },
    );
  }
}

module.exports = {
  drawMario: (text, callback, msg, data) => {
    startDraw(text, callback, msg, data);
  },
};
