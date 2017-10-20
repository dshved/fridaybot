'use strict';
const request = require('request');
const { promisify } = require('util');
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);
const Jimp = require('jimp');
const { sayBorderText } = require('./say');
const { UserMessages } = require('./../../models/usermessage');
const { Police } = require('./../../models/police');
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
  const res = await Police.findOne({ image_id: imageId });
  if (res) {
    const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:`;
    attachment.attachments = [
      {
        fallback: message,
        color: '#ff0000',
        image_url: `https://fridaybot.tk/${res.image_url}`,
      },
    ];

    return callback(message, {}, attachment);
  } else {
    const imgInfo = {
      1: {
        imagePath: './public/images/police/mask_1.png',
        imagePositions: [[404, 357]],
      },
      2: {
        imagePath: './public/images/police/mask_2.png',
        imagePositions: [[352, 354], [652, 354]],
      },
      3: {
        imagePath: './public/images/police/mask_3-5.png',
        imagePositions: [[518, 249], [730, 249], [985, 249]],
      },
      4: {
        imagePath: './public/images/police/mask_3-5.png',
        imagePositions: [[518, 249], [730, 249], [985, 249], [1175, 249]],
      },
      5: {
        imagePath: './public/images/police/mask_3-5.png',
        imagePositions: [
          [518, 249],
          [730, 249],
          [985, 249],
          [1175, 249],
          [1398, 249],
        ],
      },
    };
    const countUser = userArray.length;
    const baseImg = await Jimp.read(imgInfo[countUser].imagePath);

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
      baseImg.composite(temp, x, y);
    }
    const endImg = await Jimp.read(imgInfo[countUser].imagePath);
    baseImg.composite(endImg, 0, 0);
    baseImg.write(`./public/uploads/police/${imageId}.jpg`);
    const newPoliceImg = new Police({
      image_id: imageId,
      image_url: `/uploads/police/${imageId}.jpg`,
    });
    newPoliceImg.save();

    const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:`;
    attachment.attachments = [
      {
        fallback: message,
        color: '#ff0000',
        image_url: `https://fridaybot.tk/uploads/police/${imageId}.jpg`,
      },
    ];

    return callback(message, {}, attachment);
  }
}

module.exports = getPolice;
