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

function checkFilter(array) {
  const filterList = [
    'no-filter',
    'smile',
    'smile_2',
    'hot',
    'old',
    'young',
    'hollywood',
    'hitman',
    'pan',
    'heisenberg',
    'female',
    'female_2',
    'male',
    'impression',
    'lion',
    'goatee',
    'hipster',
    'bangs',
    'glasses',
    'wave',
    'makeup',
  ];
  const newArray = [];
  array.forEach(filterName => {
    const filtred = filterList.filter(
      item => item.replace('_', '') === filterName.toLowerCase(),
    );
    if (filtred.length > 0) {
      newArray.push(filtred[0]);
    }
  });
  return newArray;
}

const combo = async (text, callback) => {
  let arr = text.replace(/\s{2,}/g, ' ').split(' ');
  const myRegexpUser = /@\w+/;
  const matchUser = text.match(myRegexpUser);
  if (matchUser) {
    arr = arr.slice(0, -1);
    arr = checkFilter(arr);
    if (arr.length > 7) {
      arr = arr.slice(0, 7);
    }

    const userId = matchUser[0].substring(1);
    const randomName = `${userId}-${Math.random()
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
      let image = await faceapp.process(bufferImage, arr[0]);

      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          image = await faceapp.process(image, arr[i]);
        }
      }
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
  // console.log(matchUser);
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
  drawImpression: (text, callback) => {
    draw('impression', text, callback);
  },
  drawLion: (text, callback) => {
    draw('lion', text, callback);
  },
  drawGoatee: (text, callback) => {
    draw('goatee', text, callback);
  },
  drawHipster: (text, callback) => {
    draw('hipster', text, callback);
  },
  drawBangs: (text, callback) => {
    draw('bangs', text, callback);
  },
  drawGlasses: (text, callback) => {
    draw('glasses', text, callback);
  },
  drawWave: (text, callback) => {
    draw('wave', text, callback);
  },
  drawMakeup: (text, callback) => {
    draw('makeup', text, callback);
  },
  drawCombo: (text, callback) => {
    combo(text, callback);
  },
};
