const express = require('express');
const router = express.Router();
const Auth = require('../middlewares/auth');
const BotMessages = require('../models/botmessage').BotMessages;
const BotSettings = require('../models/botsetting').BotSettings;
const Stickers = require('../models/sticker').Sticker;

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

module.exports = router;
