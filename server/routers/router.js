const express = require('express');
const router = express.Router();
const Auth = require('../middlewares/auth');
const BotMessages = require('../models/botmessage').BotMessages;
const BotSettings = require('../models/botsetting').BotSettings;
const Donate = require('../models/donate');
const Stickers = require('../models/sticker').Sticker;
const Jimp = require('jimp');
const config = require('./../../config.js');
const request = require('request');

router.get('/', (req, res, next) => {
  if (!req.session.token) {
    res.render('index');
  } else {
    res.redirect('/home');
  }

  // res.render('index', { title: 'Express' });
});

router.get('/home', Auth, (req, res, next) => {
  const data = {};
  BotMessages.find({}).then(messages => {
    if (messages) {
      data.messages = messages;
      BotSettings.findOne().then(settings => {
        if (settings) {
          data.settings = settings;
          Stickers.find({}).then(stickers => {
            if (stickers) {
              data.stickers = stickers;
              res.render('home', {
                messages: data.messages,
                settings: data.settings,
                stickers: data.stickers,
              });
            }
          });
        }
      });
    }
  });
});

router.get('/police/:id', (req, res, next) => {
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

  async function getImage(src) {
    return await Jimp.read(src);
  }

  async function draw() {
    const response = await promiseRequest({
      url: `https://slack.com/api/users.info?token=${config.bot
        .token}&user=${req.params.id}&pretty=1`,
      encoding: null,
    });
    const { user, ok } = JSON.parse(response);
    if (!ok) {
      res.send('error');
      return;
    }
    const baseImg = await Jimp.read('./public/images/police/mask_1.png');
    let temp = await getImage(user.profile.image_192);
    baseImg.composite(temp, 404, 357);
    const endImg = await Jimp.read('./public/images/police/mask_1.png');
    baseImg.composite(endImg, 0, 0);
    baseImg.getBase64(Jimp.MIME_PNG, function(err, base) {
      res.writeHead('200', {
        'Content-Type': 'image/png',
      });
      res.end(new Buffer(base.split(',')[1], 'base64'), 'binary');
    });
  }

  draw();
});

router.get('/donate', (req, res) => {
  Donate.find({}).then(data => {
    res.render('donate', { data });
  });
});

router.get('/donate/parrot', (req, res) => {
  res.render('donate-add');
});

router.post('/donate/parrot', (req, res) => {
  const newDonate = new Donate({
    user: req.body.user,
  });
  newDonate.save(err => {
    if (!err) {
      res.render('donate-add');
    } else {
      res.send(503);
    }
  });
});

module.exports = router;
