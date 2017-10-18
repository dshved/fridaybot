'use strict';
const request = require('request');
const PImage = require('pureimage');
const fs = require('fs');

const sayBorderText = require('./say').sayBorderText;
const UserMessages = require('./../../models/usermessage').UserMessages;
const config = require('./../../../config.js');

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

function convertImage(url, userName, cb) {
  var path = './public/uploads/police/';
  var promise = new Promise((resolve, reject) => {
    var ext = /\.png$/.test(url) ? 'png' : 'jpg';
    var picStream = fs.createWriteStream(`${path}${userName}.${ext}`);
    picStream.on('close', function() {
      resolve(ext);
    });
    request(url).pipe(picStream);
  });

  promise.then(type => {
    var image = PImage.make(192, 192);
    var ctx = image.getContext('2d');
    const METHOD = type === 'png' ? 'PNG' : 'JPEG';
    PImage[`decode${METHOD}FromStream`](
      fs.createReadStream(`${path}${userName}.${type}`),
    ).then(img => {
      draw(ctx, img);
      PImage[`encode${METHOD}ToStream`](
        image,
        fs.createWriteStream(`${path}${userName}_police.${type}`),
      ).then(() => {
        fs.unlink(`${path}${userName}.${type}`, err => {
          if (!err) cb(`/uploads/police/${userName}_police.${type}`);
        });
      });
    });
  });
}

async function getPolice(text, callback, msg) {
  const attachment = {};
  attachment.username = 'милиция';
  attachment.icon_emoji = ':warneng:';
  const myRegexpUser = /@\w+/g;
  const matchUser = text.match(myRegexpUser);

  if (text.startsWith(msg)) {
    if (matchUser) {
      let users = [];
      for (let i = 0; i < matchUser.length; i++) {
        users.push(`${matchUser[i]}`);
      }

      const unique = arr => {
        const obj = {};

        for (let i = 0; i < arr.length; i++) {
          const str = arr[i];
          obj[str] = true;
        }

        return Object.keys(obj);
      };

      users = unique(users);

      if (users.length > 5) {
        callback(
          'Автозак не резиновый!\nНе больше 5-ти человек :warneng:',
          {},
          attachment,
        );
      } else if (users.length === 1) {
        let userId = users[0].substr(1, users[0].length);
        const res = await UserMessages.findOne({ user_id: userId });
        if (res) {
          if (!res.user_police_img) {
            request(
              {
                url: `https://slack.com/api/users.info?token=${config.bot
                  .token}&user=${userId}&pretty=1`,
                encoding: null,
              },
              (err, res, body) => {
                const json = JSON.parse(body);
                if (json.ok) {
                  const userName = json.user.name;
                  const imageURL = json.user.profile.image_192;
                  convertImage(imageURL, userName, path => {
                    UserMessages.findOneAndUpdate(
                      { user_id: userId },
                      { user_police_img: path },
                    ).then(() => {
                      const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse: ${userName}\nВы окружены!!!\n`;
                      attachment.attachments = [
                        {
                          fallback: message,
                          color: '#ff0000',
                          image_url: `https://fridaybot.tk/${path}`,
                        },
                      ];
                      callback(message, {}, attachment);
                    });
                  });
                }
              },
            );
          } else {
            const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse: ${res.user_name}\nВы окружены!!!\n`;
            attachment.attachments = [
              {
                fallback: message,
                color: '#ff0000',
                image_url: `https://fridaybot.tk/${res.user_police_img}`,
              },
            ];
            callback(message, {}, attachment);
          }
        }
      } else {
        const fn = function asyncMultiply(user) {
          return new Promise(resolve => {
            sayBorderText(user, false, 100, cb => {
              resolve(cb);
            });
          });
        };

        const actions = users.map(fn);

        const results = Promise.all(actions);
        results.then(data => {
          const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse:\n${data}Вы окружены!!!\n`;
          callback(message, {}, attachment);
        });
      }
    } else {
      callback(
        ':drudgesiren:Господин полицейский всегда на страже закона.:drudgesiren:\nЕсли у вас жалоба на конкретного человека, то повторите команду и укажите его @username',
        {},
        attachment,
      );
    }
  }
}

module.exports = {
  police: (text, callback, msg) => {
    getPolice(text, callback, msg);
  },
};
