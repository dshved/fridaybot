const request = require('request');
const { random } = require('lodash');
const fs = require('fs');

const Jimp = require('jimp');
const GIFEncoder = require('gifencoder');

const imgInfo = {
  1: [
    {
      imageNames: ['bus-1-1.png', 'bus-1-2.png', 'bus-1-3.png'],
      imagePositions: [[542, 134]],
    },
  ],
  2: [
    {
      imageNames: ['bus-1-1.png', 'bus-1-2.png', 'bus-1-3.png'],
      imagePositions: [[542, 134], [685, 134]],
    },
  ],
  3: [
    {
      imageNames: ['bus-1-1.png', 'bus-1-2.png', 'bus-1-3.png'],
      imagePositions: [[542, 134], [685, 134], [828, 134]],
    },
  ],
  4: [
    {
      imageNames: ['bus-1-1.png', 'bus-1-2.png', 'bus-1-3.png'],
      imagePositions: [[542, 134], [685, 134], [828, 134], [971, 134]],
    },
  ],
  5: [
    {
      imageNames: ['bus-1-1.png', 'bus-1-2.png', 'bus-1-3.png'],
      imagePositions: [
        [542, 134],
        [685, 134],
        [828, 134],
        [971, 134],
        [1116, 134],
      ],
    },
  ],
};

const imgDesc = {
  1: ['bus-desc-1.png', 'bus-desc-2.png', 'bus-desc-3.png', 'bus-desc-4.png'],
  2: ['bus-desc-1.png', 'bus-desc-2.png', 'bus-desc-3.png', 'bus-desc-4.png'],
};

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

async function getProfileImages(users) {
  const profileImages = [];
  for (let i = 0; i < users.length; i++) {
    const response = await promiseRequest({
      url: `https://slack.com/api/users.info?token=${global.BOT_TOKEN}&user=${users[
        i
      ]}&pretty=1`,
      encoding: null,
    });
    const { user, ok } = JSON.parse(response);
    if (!ok) {
      return false;
    }

    const temp = await Jimp.read(user.profile.image_192);
    temp.resize(128, Jimp.AUTO);
    profileImages.push(temp);
  }
  return profileImages;
}

async function getPartyImage(userImages, randomName) {
  const countUsers = userImages.length;
  const randomImage = random(imgInfo[countUsers].length - 1);
  const baseImg = await Jimp.read(
    `./public/images/police/${imgInfo[countUsers][randomImage].imageNames[0]}`,
  );
  const { width, height } = baseImg.bitmap;
  const template = new Jimp(width, height, 0xffffffff);
  const clear = new Jimp(width, height, 0xffffffff);
  const textName =
    countUsers > 1
      ? imgDesc[2][random(imgDesc[2].length - 1)]
      : imgDesc[1][random(imgDesc[1].length - 1)];
  const wastedText = await Jimp.read(`./public/images/police/${textName}`);
  wastedText.rotate(random(-15, 15));
  let x;
  let y;
  const ava = new Jimp(width, height, 0xffffffff);
  for (let i = 0; i < userImages.length; i++) {
    x = imgInfo[countUsers][randomImage].imagePositions[i][0];
    y = imgInfo[countUsers][randomImage].imagePositions[i][1];
    ava.composite(userImages[i], x, y);
  }

  const encoder = new GIFEncoder(width, height);
  encoder
    .createReadStream()
    .pipe(
      fs.createWriteStream(`./public/uploads/police/${randomName}-party.gif`),
    );
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(5);

  template.composite(clear, 0, 0);
  template.composite(ava, 0, 0);
  template.composite(baseImg, 0, 0);
  template.composite(wastedText, 100, height - wastedText.bitmap.height - 100);

  encoder.addFrame(template.bitmap.data);
  const frame = await Jimp.read(
    `./public/images/police/${imgInfo[countUsers][randomImage].imageNames[1]}`,
  );

  template.composite(clear, 0, 0);
  template.composite(ava, 0, 12);
  template.composite(frame, 0, 0);
  template.composite(wastedText, 100, height - wastedText.bitmap.height - 100);
  encoder.addFrame(template.bitmap.data);

  const frame2 = await Jimp.read(
    `./public/images/police/${imgInfo[countUsers][randomImage].imageNames[2]}`,
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
}

async function getParty(text, callback) {
  const attachment = {
    username: 'Пати Мен',
    icon_emoji: ':driver:',
  };
  const myRegexpUser = /@\w+/g;
  const matchUser = text.match(myRegexpUser);

  if (!matchUser) {
    return callback(
      ':driver:Садись прокачу:driver:\n Просто напиши @username, кого нужно покатать на пати бусе',
      {},
      attachment,
    );
  }

  const users = [...new Set(matchUser)];

  if (users.length > 5) {
    return callback(
      'Пати бус не резиновый!\nНе больше 5-ти человек :driver:',
      {},
      attachment,
    );
  }

  const imageId = users.join('-').replace(/@/g, '');
  const userArray = imageId.split('-');
  const profileImages = await getProfileImages(userArray);
  const randomName = `${imageId}-${Math.random()
    .toString(36)
    .substring(2)}`;

  getPartyImage(profileImages, randomName);
  const message =
    ':driver::driver::driver::driver::driver::driver::driver::driver::driver::driver:';
  attachment.attachments = [
    {
      fallback: message,
      color: '#ff0000',
      image_url: `https://fridaybot.tk/uploads/police/${randomName}-party.gif`,
    },
  ];
  return callback(message, {}, attachment);
}

module.exports = {
  getParty: (text, callback) => {
    getParty(text, callback);
  },
};
