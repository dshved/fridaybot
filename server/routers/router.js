const express = require('express');

const router = express.Router();
const Auth = require('../middlewares/auth');
const BotMessages = require('../models/botmessage').BotMessages;
const BotSettings = require('../models/botsetting').BotSettings;
const Donate = require('../models/donate');
const Stickers = require('../models/sticker').Sticker;

router.get('/', (req, res) => {
  if (!req.session.token) {
    res.render('index');
  } else {
    res.redirect('/home');
  }
});

router.get('/home', Auth, (req, res) => {
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
