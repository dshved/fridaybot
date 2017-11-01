const request = require('request');
const fs = require('fs');
const faceapp = require('faceapp');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const config = require('../../../config');

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

function getBigImageUrl(data) {
  let url;
  if ('image_1024' in data) {
    url = data.image_1024;
  } else if ('image_512' in data) {
    url = data.image_512;
  } else {
    url = data.image_192;
  }
  return url;
}

const draw = async (mask, text, callback) => {
  const myRegexpUser = /@\w+/;
  const matchUser = text.match(myRegexpUser);
  if (matchUser) {
    const userId = matchUser[0].substring(1);
    const randomName = `${userId}-${mask}-${Math.random()
      .toString(36)
      .substring(2)}.jpg`;
    try {
      const response = await promiseRequest({
        url: `https://slack.com/api/users.info?token=${config.bot
          .token}&user=${userId}&pretty=1`,
        encoding: null,
      });
      const { user, ok } = JSON.parse(response);
      if (!ok) {
        return;
      }
      const userImageUrl = getBigImageUrl(user.profile);

      const bufferImage = await promiseRequest({
        url: userImageUrl,
        encoding: null,
      });
      const image = await faceapp.process(bufferImage, mask);

      await writeFileAsync(`./public/uploads/mask/${randomName}`, image);
      const attachment = {
        username: 'fridaybot',
        icon_emoji: ':fridaybot_new:',
        attachments: [
          {
            fallback: 'Faceapp',
            color: '#ff0000',
            image_url: `https://fridaybot.tk/uploads/mask/${randomName}`,
          },
        ],
      };
      callback('', {}, attachment);
    } catch (err) {
      callback(err.message, {});
    }
  }
};

module.exports = {
  drawSmile: (text, callback) => {
    draw('smile', text, callback);
  },
  drawSmile2: (text, callback) => {
    draw('smile_2', text, callback);
  },
  drawHot: (text, callback) => {
    draw('hot', text, callback);
  },
  drawOld: (text, callback) => {
    draw('old', text, callback);
  },
  drawYoung: (text, callback) => {
    draw('young', text, callback);
  },
  drawFemale2: (text, callback) => {
    draw('female_2', text, callback);
  },
  drawFemale: (text, callback) => {
    draw('female', text, callback);
  },
  drawMale: (text, callback) => {
    draw('male', text, callback);
  },
  drawPan: (text, callback) => {
    draw('pan', text, callback);
  },
  drawHitman: (text, callback) => {
    draw('hitman', text, callback);
  },
  drawHollywood: (text, callback) => {
    draw('hollywood', text, callback);
  },
  drawHeisenberg: (text, callback) => {
    draw('heisenberg', text, callback);
  },
};
