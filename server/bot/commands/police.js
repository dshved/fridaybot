'use strict';
const request = require('request');
const { promisify } = require('util');
const { random } = require('lodash');
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);
const Jimp = require('jimp');
const GIFEncoder = require('gifencoder');
const config = require('./../../../config.js');

function promiseRequest(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
}

async function getPolice(text, callback, msg) {
  const attachment = {
    username: 'милиция',
    icon_emoji: ':warneng:',
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

  const users = [...new Set(matchUser)]; //unique array elements

  if (users.length > 5) {
    return callback(
      'Автозак не резиновый!\nНе больше 5-ти человек :warneng:',
      {},
      attachment,
    );
  }

  const imageId = users.join('-').replace(/@/g, '');
  const userArray = imageId.split('-');

  const imgInfo = {
    1: {
      imageNames: ['mask_1-1.png', 'mask_1-2.png', 'mask_1-3.png'],
      imagePositions: [[404, 357]],
    },
    2: {
      imageNames: ['mask_2-1.png', 'mask_2-2.png', 'mask_2-3.png'],
      imagePositions: [[352, 354], [652, 354]],
    },
    3: {
      imageNames: ['mask_3-5-1.png', 'mask_3-5-2.png', 'mask_3-5-3.png'],
      imagePositions: [[518, 249], [730, 249], [958, 249]],
    },
    4: {
      imageNames: ['mask_3-5-1.png', 'mask_3-5-2.png', 'mask_3-5-3.png'],
      imagePositions: [[518, 249], [730, 249], [958, 249], [1175, 249]],
    },
    5: {
      imageNames: ['mask_3-5-1.png', 'mask_3-5-2.png', 'mask_3-5-3.png'],
      imagePositions: [
        [518, 249],
        [730, 249],
        [958, 249],
        [1175, 249],
        [1398, 249],
      ],
    },
  };

  const imgDesc = {
    1: [
      '228.png',
      'badcoder.png',
      'mastercommit.png',
      'wasted.png',
      'wastedrus.png',
    ],
    2: [
      '228.png',
      'badcoders.png',
      'mastercommits.png',
      'wasted.png',
      'wastedrus.png',
    ],
  };

  const countUser = userArray.length;
  const randomName = `${imageId}-${Math.random()
    .toString(36)
    .substring(2)}`;
  const baseImg = await Jimp.read(
    `./public/images/police/${imgInfo[countUser].imageNames[0]}`,
  );
  const { width, height } = baseImg.bitmap;
  const encoder = new GIFEncoder(width, height);
  encoder
    .createReadStream()
    .pipe(fs.createWriteStream(`./public/uploads/police/${randomName}.gif`));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(5);

  let template = new Jimp(width, height);
  let clear = new Jimp(width, height, 0xffffffff);
  let ava = new Jimp(width, height);
  let textName =
    countUser > 1
      ? imgDesc[2][random(imgDesc[2].length) - 1]
      : imgDesc[1][random(imgDesc[1].length) - 1];
  let wastedText = await Jimp.read(`./public/images/police/${textName}`);
  wastedText.rotate(random(-15, 15));
  for (let i = 0; i < userArray.length; i++) {
    const response = await promiseRequest({
      url: `https://slack.com/api/users.info?token=${config.bot
        .token}&user=${userArray[i]}&pretty=1`,
      encoding: null,
    });
    const { user, ok } = JSON.parse(response);
    if (!ok) {
      return;
    }

    let temp = await Jimp.read(user.profile.image_192);
    let x = imgInfo[countUser].imagePositions[i][0];
    let y = imgInfo[countUser].imagePositions[i][1];
    ava.composite(temp, x, y);
  }
  //переписать эту простыню
  template.composite(clear, 0, 0);
  template.composite(ava, 0, 0);
  template.composite(baseImg, 0, 0);
  template.composite(wastedText, 100, height - wastedText.bitmap.height - 100);

  encoder.addFrame(template.bitmap.data);

  let frame = await Jimp.read(
    `./public/images/police/${imgInfo[countUser].imageNames[1]}`,
  );

  template.composite(clear, 0, 0);
  template.composite(ava, 0, 12);
  template.composite(frame, 0, 0);
  template.composite(wastedText, 100, height - wastedText.bitmap.height - 100);
  encoder.addFrame(template.bitmap.data);

  let frame2 = await Jimp.read(
    `./public/images/police/${imgInfo[countUser].imageNames[2]}`,
  );

  template.composite(clear, 0, 0);
  template.composite(ava, 0, 24);
  template.composite(frame2, 0, 0);
  template.composite(wastedText, 100, height - wastedText.bitmap.height - 100);
  encoder.addFrame(template.bitmap.data);

  template.composite(clear, 0, 0);
  template.composite(ava, 0, 12);
  template.composite(frame, 0, 0);
  template.composite(wastedText, 100, height - wastedText.bitmap.height - 100);
  encoder.addFrame(template.bitmap.data);

  encoder.finish();

  const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:`;
  attachment.attachments = [
    {
      fallback: message,
      color: '#ff0000',
      image_url: `https://fridaybot.tk/uploads/police/${randomName}.gif`,
    },
  ];

  return callback(message, {}, attachment);
}

module.exports = getPolice;
