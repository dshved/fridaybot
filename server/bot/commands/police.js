const request = require('request');
const { random } = require('lodash');
const fs = require('fs');

const Jimp = require('jimp');
const GIFEncoder = require('gifencoder');
const querystring = require('querystring');

const imgInfo = {
  1: {
    imageNames: ['mask_1-1.png', 'mask_1-2.png', 'mask_1-3.png'],
    imagePositions: [[240, 214]],
  },
  2: {
    imageNames: ['mask_2-1.png', 'mask_2-2.png', 'mask_2-3.png'],
    imagePositions: [[214, 214], [403, 218]],
  },
  3: {
    imageNames: ['mask_3-5-1.png', 'mask_3-5-2.png', 'mask_3-5-3.png'],
    imagePositions: [[328, 155], [467, 155], [612, 155]],
  },
  4: {
    imageNames: ['mask_4-1.png', 'mask_4-2.png', 'mask_4-3.png'],
    imagePositions: [[255, 116], [380, 116], [506, 116], [634, 116]],
  },
  5: {
    imageNames: ['mask_3-5-1.png', 'mask_3-5-2.png', 'mask_3-5-3.png'],
    imagePositions: [
      [328, 155],
      [467, 155],
      [612, 155],
      [754, 155],
      [892, 155],
    ],
  },
};

const imgEscape = {
  1: {
    imageName: 'escape-1.png',
    imagePositions: [[359, 192]],
  },
  2: {
    imageName: 'escape-2.png',
    imagePositions: [[359, 192], [192, 257]],
  },
  3: {
    imageName: 'escape-3.png',
    imagePositions: [[359, 192], [192, 257], [40, 270]],
  },
  4: {
    imageName: 'escape-4.png',
    imagePositions: [[359, 192], [192, 257], [40, 270], [551, 257]],
  },
  5: {
    imageName: 'escape-5.png',
    imagePositions: [[359, 192], [192, 257], [40, 270], [551, 257], [134, 111]],
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

const imgAmnesty = {
  1: {
    imageNames: ['amnesty_1.png'],
    imagePositions: [[590, 306]],
  },
  2: {
    imageNames: ['amnesty_2.png'],
    imagePositions: [[590, 306], [768, 364]],
  },
  3: {
    imageNames: ['amnesty_3.png'],
    imagePositions: [[590, 306], [768, 364], [850, 237]],
  },
  4: {
    imageNames: ['amnesty_4.png'],
    imagePositions: [[590, 306], [768, 364], [850, 237], [708, 235]],
  },
  5: {
    imageNames: ['amnesty_5.png'],
    imagePositions: [
      [590, 306],
      [768, 364],
      [850, 237],
      [708, 235],
      [994, 255],
    ],
  },
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

async function sendAmnisty(filename, channel) {
  const url = {
    token: global.BOT_TOKEN,
    channel,
    text: 'Решение суда',
    attachments: `[{"text": "","fallback": "Youme", "color": "#3AA3E3","image_url": "https://fridaybot.tk/uploads/police/${filename}-amnesty.jpg",}]`,
    icon_emoji: ':warneng:',
    username: 'милиция',
    pretty: '1',
  };
  setTimeout(async () => {
    await promiseRequest(
      `https://slack.com/api/chat.postMessage?${querystring.stringify(url)}`,
    );
  }, 30000);
}

async function delPrePolice({ ts, channel }) {
  const url = `https://slack.com/api/chat.delete?token=${global.BOT_TOKEN}&channel=${channel}&ts=${ts}`;
  await promiseRequest(url);
}

async function prePoliceQuery(channel) {
  const url = {
    token: global.BOT_TOKEN,
    channel,
    text: 'Вызов принят',
    icon_emoji: ':warneng:',
    username: 'милиция',
    pretty: '1',
  };
  const result = await promiseRequest(
    `https://slack.com/api/chat.postMessage?${querystring.stringify(url)}`,
  );
  return JSON.parse(result);
}

async function getPolice(text, callback, msg, { channel }) {
  const attachment = {
    username: 'милиция',
    icon_emoji: ':warneng:',
  };
  const myRegexpUser = /@\w+/g;
  const matchUser = text.match(myRegexpUser);

  if (!matchUser) {
    return callback(
      ':drudgesiren:Господин полицейский всегда на страже закона.:drudgesiren:\nЕсли у вас жалоба на конкретного человека, то повторите команду и укажите его @username',
      {},
      attachment,
    );
  }

  const users = [...new Set(matchUser)];

  if (users.length > 5) {
    return callback(
      'Автозак не резиновый!\nНе больше 5-ти человек :warneng:',
      {},
      attachment,
    );
  }

  const imageId = users.join('-').replace(/@/g, '');
  const userArray = imageId.split('-');
  const preMessageData = await prePoliceQuery(channel);
  const countUser = userArray.length;
  const randomName = `${imageId}-${Math.random()
    .toString(36)
    .substring(2)}`;
  const policeEscape = random(5);

  let baseImg;
  const baseAmnestyImg = await Jimp.read(
    `./public/images/police/${imgAmnesty[countUser].imageNames[0]}`,
  );
  if (policeEscape) {
    baseImg = await Jimp.read(
      `./public/images/police/${imgInfo[countUser].imageNames[0]}`,
    );
  } else {
    baseImg = await Jimp.read(
      `./public/images/police/${imgEscape[countUser].imageName}`,
    );
  }

  const { width, height } = baseImg.bitmap;
  const { width: amnestyWidth, height: amnestyHeight } = baseAmnestyImg.bitmap;
  const encoder = new GIFEncoder(width, height);
  encoder
    .createReadStream()
    .pipe(fs.createWriteStream(`./public/uploads/police/${randomName}.gif`));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(5);

  const template = new Jimp(width, height);
  const clear = new Jimp(width, height, 0xffffffff);
  const ava = new Jimp(width, height);
  const amnestyAva = new Jimp(amnestyWidth, amnestyHeight);
  const textName =
    countUser > 1
      ? imgDesc[2][random(imgDesc[2].length - 1)]
      : imgDesc[1][random(imgDesc[1].length - 1)];
  const wastedText = await Jimp.read(`./public/images/police/${textName}`);
  wastedText.rotate(random(-15, 15));
  for (let i = 0; i < userArray.length; i++) {
    const response = await promiseRequest({
      url: `https://slack.com/api/users.info?token=${global.BOT_TOKEN}&user=${userArray[
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
    let x;
    let y;
    let x1;
    let y1;
    if (policeEscape) {
      x = imgInfo[countUser].imagePositions[i][0];
      y = imgInfo[countUser].imagePositions[i][1];

      x1 = imgAmnesty[countUser].imagePositions[i][0];
      y1 = imgAmnesty[countUser].imagePositions[i][1];
      amnestyAva.composite(temp, x1, y1);
    } else {
      x = imgEscape[countUser].imagePositions[i][0];
      y = imgEscape[countUser].imagePositions[i][1];
    }

    ava.composite(temp, x, y);
  }
  if (!policeEscape) {
    template.composite(clear, 0, 0);
    template.composite(ava, 0, 0);
    template.composite(baseImg, 0, 0);
    encoder.addFrame(template.bitmap.data);
    encoder.finish();

    const message = 'Не в этот раз, господин полицейский!!!';
    attachment.username = 'Азаза';
    attachment.icon_emoji = ':trollface:';

    attachment.attachments = [
      {
        fallback: message,
        color: '#ff0000',
        image_url: `https://fridaybot.tk/uploads/police/${randomName}.gif`,
      },
    ];
    delPrePolice(preMessageData);
    return callback(message, {}, attachment);
  } else {
    // переписать эту простыню
    template.composite(clear, 0, 0);
    template.composite(ava, 0, 0);
    template.composite(baseImg, 0, 0);
    template.composite(
      wastedText,
      100,
      height - wastedText.bitmap.height - 100,
    );

    encoder.addFrame(template.bitmap.data);
    const frame = await Jimp.read(
      `./public/images/police/${imgInfo[countUser].imageNames[1]}`,
    );

    template.composite(clear, 0, 0);
    template.composite(ava, 0, 12);
    template.composite(frame, 0, 0);
    template.composite(
      wastedText,
      100,
      height - wastedText.bitmap.height - 100,
    );
    encoder.addFrame(template.bitmap.data);

    const frame2 = await Jimp.read(
      `./public/images/police/${imgInfo[countUser].imageNames[2]}`,
    );

    template.composite(clear, 0, 0);
    template.composite(ava, 0, 24);
    template.composite(frame2, 0, 0);
    template.composite(
      wastedText,
      100,
      height - wastedText.bitmap.height - 100,
    );
    encoder.addFrame(template.bitmap.data);

    template.composite(clear, 0, 0);
    template.composite(ava, 0, 12);
    template.composite(frame, 0, 0);
    template.composite(
      wastedText,
      100,
      height - wastedText.bitmap.height - 100,
    );
    encoder.addFrame(template.bitmap.data);

    encoder.finish();

    const message =
      ':drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:';
    attachment.attachments = [
      {
        fallback: message,
        color: '#ff0000',
        image_url: `https://fridaybot.tk/uploads/police/${randomName}.gif`,
      },
    ];
    delPrePolice(preMessageData);

    const amnestyText = await Jimp.read(
      `./public/images/police/amnesty_text_${random(1, 7)}.png`,
    );

    amnestyAva
      .composite(baseAmnestyImg, 0, 0)
      .composite(amnestyText, 100, baseAmnestyImg.bitmap.height - 150)
      .quality(60)
      .write(`./public/uploads/police/${randomName}-amnesty.jpg`, () =>
        sendAmnisty(randomName, channel),
      );
    return callback(message, {}, attachment);
  }
}

module.exports = {
  getPolice: (text, callback, msg, data) => {
    getPolice(text, callback, msg, data);
  },
};
