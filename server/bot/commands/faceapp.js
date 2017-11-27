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

function checkFilter(array) {
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

async function getImage(url) {
  const obj = {};
  try {
    obj.bufferImage = await promiseRequest({
      url,
      encoding: null,
    });
    obj.ok = true;
  } catch (err) {
    obj.ok = false;
    obj.message = err.message;
  }
  return obj;
}

async function checkImage(str) {
  const myRegexpUser = /@\w+/;
  const matchUser = str.match(myRegexpUser);
  const url = str.substring(1, str.length - 1);
  const matchUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(url);

  const randomName = `${Math.random()
    .toString(36)
    .substring(2)}.jpg`;
  let result;
  if (matchUser) {
    const userId = matchUser[0].substring(1);
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
    result = await getImage(userImageUrl);

    result.fileName = randomName;
    return result;
  } else if (matchUrl) {
    result = await getImage(url);
    result.fileName = randomName;
    return result;
  }
  return { ok: false };
}

const combo = async (text, callback) => {
  let arr = text
    .trim()
    .replace(/\s{2,}/g, ' ')
    .split(' ');
  const { ok, bufferImage, fileName } = await checkImage(arr[arr.length - 1]);

  if (ok) {
    arr = arr.slice(0, -1);
    arr = checkFilter(arr);
    if (arr.length > 7) {
      arr = arr.slice(0, 7);
    }
    try {
      let image = await faceapp.process(bufferImage, arr[0]);

      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          image = await faceapp.process(image, arr[i]);
        }
      }
      await writeFileAsync(`./public/uploads/mask/${fileName}`, image);

      const attachment = {
        username: 'fridaybot',
        icon_emoji: ':fridaybot_new:',
        attachments: [
          {
            fallback: 'Faceapp',
            color: '#ff0000',
            image_url: `https://fridaybot.tk/uploads/mask/${fileName}`,
          },
        ],
      };
      callback('', {}, attachment);
    } catch (err) {
      callback(err.message, {});
    }
  }
};

const getFilterList = (text, callback) => {
  let message = '';
  filterList.forEach(item => {
    message += `${item.replace('_', '')}\n`;
  });
  callback(message, {});
};

module.exports = {
  drawCombo: (text, callback) => {
    combo(text, callback);
  },
  getFilterList: (text, callback) => {
    getFilterList(text, callback);
  },
};
