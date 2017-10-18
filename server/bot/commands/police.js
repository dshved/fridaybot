'use strict';
const request = require('request');
const PImage = require('pureimage');
const { promisify } = require('util');
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

const { sayBorderText } = require('./say');
const { UserMessages } = require('./../../models/usermessage');
const config = require('./../../../config.js');

function promiseRequest(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    })
  });
}

function draw(ctx, img) {
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 192, 192);
  ctx.beginPath();
  ctx.lineWidth = 20;
  ctx.moveTo(30, 0);
  ctx.lineTo(30, 192);

  ctx.moveTo(162, 0);
  ctx.lineTo(162, 192);

  ctx.moveTo(0, 40);
  ctx.lineTo(192, 40);

  ctx.moveTo(0, 162);
  ctx.lineTo(192, 162);

  ctx.stroke();
}

async function convertImage(url, userName) {
  try {
    const path = './public/uploads/police/';
    const ext = /\.png$/.test(url) ? 'png' : 'jpg';
    const file = await promiseRequest(url);
    await writeFileAsync(`${path}${userName}.${ext}`, file);
    const image = PImage.make(192, 192);
    const ctx = image.getContext('2d');
    const METHOD = ext === 'png' ? 'PNG' : 'JPEG';
    const img = await PImage[`decode${METHOD}FromStream`](fs.createReadStream(`${path}${userName}.${ext}`));
    draw(ctx, img);
    await PImage[`encode${METHOD}ToStream`](image, fs.createWriteStream(`${path}${userName}_police.${ext}`));
    await unlinkAsync(`${path}${userName}.${ext}`);
    return `/uploads/police/${userName}_police.${ext}`;
  }
  catch (err) {
    console.error(err);
  }
}


async function getPolice(text, callback, msg) {
  const attachment = {
    username: 'милиция',
    icon_emoji: ':warneng:'
  };
  const myRegexpUser = /@\w+/g;
  const matchUser = text.match(myRegexpUser);
  if (!text.startsWith(msg)) {
    return;
  }
  if (!matchUser) {
    return callback(
      ':drudgesiren:Господин полицейский всегда на страже закона.:drudgesiren:\nЕсли у вас жалоба на конкретного человека, то повторите команду и укажите его @username',
      {},
      attachment,
    );
  }
  //if we have only one user we may not care about unique
  if (matchUser.length === 1) {
    const userId = users[0].substr(1, users[0].length);
    const res = await UserMessages.findOne({ user_id: userId });
    if (!res) {
      return;
    }
    if (res.user_police_img) {
      const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse: ${res.user_name}\nВы окружены!!!\n`;
      attachment.attachments = [
        {
          fallback: message,
          color: '#ff0000',
          image_url: `https://fridaybot.tk/${res.user_police_img}`,
        },
      ];
      return callback(message, {}, attachment);
    }
    const response = await promiseRequest({
        url: `https://slack.com/api/users.info?token=${config.bot.token}&user=${userId}&pretty=1`,
        encoding: null,
    });
    const { user, ok } = JSON.parse(response);
    if (!ok) {
      console.log(err, 'something went wrong with request');
      return;
    }
    const userName = user.name;
    const imageURL = user.profile.image_192;
    const imagePath = await convertImage(imageURL, userName);
    await UserMessages.findOneAndUpdate(
      { user_id: userId },
      { user_police_img: imagePath },
    );
    const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse: ${userName}\nВы окружены!!!\n`;
    attachment.attachments = [
      {
        fallback: message,
        color: '#ff0000',
        image_url: `https://fridaybot.tk/${path}`,
      },
    ];
    return callback(message, {}, attachment);
  }

  const users = [...new Set(matchUser)]; //unique array elements

  if (users.length > 5) {
    return callback(
      'Автозак не резиновый!\nНе больше 5-ти человек :warneng:',
      {},
      attachment,
    );
  }

  const asyncMultiply = user => {
    return new Promise(resolve => {
      sayBorderText(user, false, 100, cb => {
        resolve(cb);
      });
    });
  };

  const actions = users.map(asyncMultiply);
  const data = await Promise.all(actions);
  const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse:\n${data}Вы окружены!!!\n`;
  return callback(message, {}, attachment);
}

module.exports = getPolice;
