const request = require('request');
const fs = require('fs');
const faceapp = require('faceapp');
const { promisify } = require('util');
const { random } = require('lodash');
const crypto = require('crypto');
const querystring = require('querystring');
const parseString = require('xml2js').parseString;
const axios = require('axios');

const writeFileAsync = promisify(fs.writeFile);

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

/* eslint-disable */
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
      url: `https://slack.com/api/users.info?token=${global.BOT_TOKEN}&user=${userId}&pretty=1`,
      encoding: null,
    });
    const { user, ok } = JSON.parse(response);
    if (!ok) {
      return;
    }
    const userImageUrl = getBigImageUrl(user.profile);
    result = await getImage(userImageUrl);
    result.imageURL = userImageUrl;
    result.fileName = randomName;
    return result;
  } else if (matchUrl) {
    result = await getImage(url);
    result.imageURL = url;
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
/* eslint-enable */
const getFilterList = (text, callback) => {
  let message = '';
  filterList.forEach(item => {
    message += `${item.replace('_', '')}\n`;
  });
  callback(message, {});
};
async function hash(key, text) {
  const hmac = crypto.createHmac('sha1', key);
  const signData = await hmac.update(text).digest('hex');
  return signData;
}

async function xml2json(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, json) => {
      if (err) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
}

async function getRequestId(urlImage, filterName) {
  const appId = '64386eb98edce542aff68f8863a43885';
  const key = '9fb4f5b6904dcce2e930e7a05c3ccb54';
  const text = `<image_process_call><image_url order="1">${urlImage}</image_url><methods_list><method order="1"><name>collage</name><params>template_name=${filterName}</params></method></methods_list><result_size>1400</result_size><result_quality>90</result_quality><template_watermark>false</template_watermark><thumb1_size>200</thumb1_size><thumb1_quality>85</thumb1_quality><lang>ru</lang><abort_methods_chain_on_error>true</abort_methods_chain_on_error></image_process_call>`;
  const signData = await hash(key, text);
  const obj = {
    app_id: appId,
    data: text,
    sign_data: signData,
  };

  const url = `http://opeapi.ws.pho.to/queue_url.php?${querystring.stringify(
    obj,
  )}`;
  const { data } = await axios.post(url);
  const { image_process_response: result } = await xml2json(data);
  return result.request_id[0];
}

async function getFunnyPhoto(filter, text, callback) {
  const arr = text
    .trim()
    .replace(/\s{2,}/g, ' ')
    .split(' ');
  const { ok, imageURL } = await checkImage(arr[arr.length - 1]);
  if (ok) {
    const photoId = await getRequestId(imageURL, filter);
    setTimeout(async () => {
      const url = `http://opeapi.ws.pho.to/getresult?request_id=${photoId}`;
      const { data } = await axios.post(url);
      const { image_process_response: result } = await xml2json(data);
      if (result.status[0] === 'OK') {
        const image = result.result_url[0];
        const attachment = {
          username: 'fridaybot',
          icon_emoji: ':fridaybot_new:',
          attachments: [
            {
              fallback: 'Faceapp',
              color: '#ff0000',
              image_url: image,
            },
          ],
        };
        callback('', {}, attachment);
      }
      callback(result.description[0], {});
    }, 3000);
  }
}
const funnyFilters = [
  'gangster',
  'girl_on_beach',
  'nun_face_in_hole',
  'eastern_stories',
  'half_robot_face_mask',
  'pirate_of_the_caribbean',
  'clown_face_in_hole',
  'gollum_face_in_hole',
  'freckles',
  'boxer',
  'model_by_the_pool',
  'soldier',
  'just_hatched_new_baby_card',
  'game_of_thrones',
  'tears_effect',
  'myrtle_tree_fairy',
  'hair_rollers',
  'mona_lisa',
  'skier',
  'i_like_money',
  'rambo',
  'hands_over_face',
  'tankman',
  'motorcyclist',
  'astronaut',
  'summer_girl',
  'white_rabbit',
  'apocalypse',
  'knight_in_arms',
  'zeus',
  'native_american_face_in_hole',
  'cupid',
  'zombie_at_the_window',
  'fireman',
  'sunny_guy',
  'flora',
  'kisses_on_face_photo_effect',
  'set_of_nesting_dolls',
  'my_xray_film',
  'windy_girl',
  'football_fight',
  'real_king_tut',
  'devil_girl',
  'blue_alien_photo_manipulation',
  'steampunk_robot_face_mask',
  'hawaiian_girl_sketch',
  'on_the_bike',
  'head_explosion_effect',
  'wild_cat_face_paint',
  'goalkeeper',
  'gymnast',
  'brown_fractal_girl',
  'prince_charming',
  'girl_flower_crown_watercolor',
  'body_study',
  'female_watercolor_portrait',
  'scarface',
  'santa_face_in_hole',
  'terminator',
  'mount_rushmore_face_in_hole',
  'navi_avatar_face_creator',
  'ninja',
  'splintered_face_montage',
  'hulk_face_in_hole',
  'darth_vader',
  'yoda',
  'iron_man',
  'soldier_girl',
  'tron',
  'twilight',
  'clear_gift',
  'superman',
  'southpark',
  'lisa_simpson',
  'bart_simpson',
  'fry_from_futurama',
  'christmas_girl_face_in_hole',
  'sketch_santa_hat',
  'starcraft_2',
  'be_mine_or_die',
];

module.exports = {
  drawCombo: (text, callback) => {
    combo(text, callback);
  },
  getFilterList: (text, callback) => {
    getFilterList(text, callback);
  },
  getRedHat: (text, callback) => {
    getFunnyPhoto('red_santa_hat', text, callback);
  },
  getFunnyPhoto: (text, callback) => {
    const randomFilter = funnyFilters[random(0, funnyFilters.length - 1)];
    getFunnyPhoto(randomFilter, text, callback);
  },
};
