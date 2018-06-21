const express = require('express');
const pm2 = require('pm2');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multiparty = require('multiparty');
const fs = require('fs');
const UserMessages = require('./../models/usermessage').UserMessages;
const BotMessages = require('./../models/botmessage').BotMessages;
const BotSettings = require('./../models/botsetting').BotSettings;
const Sticker = require('./../models/sticker').Sticker;
const Statistics = require('./../models/statistics').Statistics;
// const auth = require('./auth').auth;

const getBotMessages = (req, res) => {
  BotMessages.find({}).then(data => {
    if (data) {
      res.send({
        msg: 'success',
        data,
      });
    } else {
      res.send(404);
    }
  });
};

const addBotMessage = (req, res) => {
  const newMessage = req.body;
  newMessage.last_edited = req.session.user;
  const botMessage = new BotMessages(newMessage);
  botMessage.save((err, data) => {
    if (!err) {
      res.send({
        msg: 'success',
        data,
      });
    } else {
      res.send(404);
    }
  });
};
/* eslint-disable */
const addSticker = (req, res, next) => {
  let emoji;
  let filePath;

  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    emoji = fields.emoji[0];
    filePath = files.image[0].path;
    let newEmoji = emoji.replace(/:/g, '').toUpperCase();
    newEmoji = `:${newEmoji}:`;

    fs.readFile(filePath, (err, data) => {
      const radom = Math.random().toString(36);
      const randomName = radom.substring(2, radom.length);
      const path =
        './public/uploads/stickers/' +
        randomName +
        '-' +
        files.image[0].originalFilename;
      fs.writeFile(path, data, error => {
        if (error) return next(err);
        const imageURL = `/uploads/stickers/${randomName}-${files.image[0]
          .originalFilename}`;
        const newSticker = new Sticker({
          emoji: newEmoji,
          image_url: imageURL,
        });
        let stickerId;
        newSticker.save((err, sticker) => {
          stickerId = sticker.id;
          res.send({
            msg: 'success',
            emoji: newEmoji,
            _id: stickerId,
            image_url: imageURL,
          });
        });

        // res.end();
      });
    });
  });
};

const removeSticker = (req, res, next) => {
  Sticker.findOne({ _id: req.body.id }).then(result => {
    if (result) {
      fs.unlink(`./public${result.image_url}`, err => {
        if (err) throw err;
        Sticker.remove({ _id: req.body.id }, (err, result) => {
          if (!err) {
            res.send({
              msg: 'success',
            });
          } else {
            console.log(err);
          }
        });
      });
    }
  });
};

const editBotMessage = (req, res, next) => {
  BotMessages.update(
    { _id: req.body.id },
    { $set: req.body.params, last_edited: req.session.user },
    (err, result) => {
      if (!err) {
        res.send({
          msg: 'success',
          user: req.session.user,
        });
      } else {
        console.log(err);
      }
    },
  );
};

const removeBotMessage = (req, res, next) => {
  BotMessages.remove({ _id: req.body.id }, (err, result) => {
    if (!err) {
      res.send({
        msg: 'success',
      });
    } else {
      console.log(err);
    }
  });
};

const getUserMessages = (req, res, next) => {
  UserMessages.find({}).then(data => {
    if (data) {
      res.send({
        msg: 'success',
        data,
      });
    } else {
      res.send(404);
    }
  });
};

const getBotSettings = (req, res, next) => {
  BotSettings.findOne({}).then(data => {
    if (data) {
      res.send({
        msg: 'success',
        data,
      });
    } else {
      res.send(404);
    }
  });
};

const editBotSettings = (req, res, next) => {
  BotSettings.update(
    { _id: req.body.id },
    { $set: req.body.params },
    (err, result) => {
      if (!err) {
        res.send({
          msg: 'success',
        });
      } else {
        res.send(404);
      }
    },
  );
};

const getStatisticsData = (date = new Date(), cb) => {
  const now = new Date(date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTimestamp = startOfDay / 1000;
  const endTimestamp = startTimestamp + 86400;
  const messages = [];
  const parrots = [];
  let totalMessages = 0;
  let totalParrots = 0;
  Statistics.find({
    timestamp: { $gte: startTimestamp, $lt: endTimestamp },
    event_type: 'user_message',
  }).then(response => {
    for (let i = 0; i < 24; i++) {
      const prevTimestamp = startTimestamp + 3600 * i;
      const nextTimestamp = startTimestamp + 3600 * (i + 1);
      const timeInterval = response.filter(item => {
        return (
          item.timestamp >= prevTimestamp && item.timestamp <= nextTimestamp
        );
      });
      messages.push(timeInterval.length);
      totalMessages += timeInterval.length;
      let parrotCounts = 0;
      timeInterval.forEach(item => (parrotCounts += item.parrot_count));
      parrots.push(parrotCounts);
      totalParrots += parrotCounts;
    }
    const data = {};
    data.messages = messages;
    data.parrots = parrots;
    data.total_messages = totalMessages;
    data.total_parrots = totalParrots;
    cb(data);
  });
};

const getStatistics = (req, res, next) => {
  const date = req.query.date;
  getStatisticsData(date, data => {
    res.send({
      msg: 'success',
      data,
    });
  });
};

const restart = (req, res, next) => {
  pm2.connect(err => {
    if (err) throw err;
    pm2.restart('Fridaybot', e => {
      console.log(e);
    });
  });
  res.send({
    msg: 'bot restarting',
  });
};

const testSlackCommand = (req, res, next) => {
  console.log(req.body);
  const testObj = {
    response_type: 'in_channel',
    text: 'gdfgd',
  };
  res.send(testObj);
};

router.get('/', (req, res) => {
  res.send('hello');
});

const auth = function(req, res, next) {
  const token =
    req.session.token ||
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'abcdef', (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
};
router.post('/addSticker', addSticker);
router.post('/removeSticker', removeSticker);
router.post('/slack/test', testSlackCommand);
router.get('/getStatistics', getStatistics);
router.use(auth);

router.get('/getBotMessages', getBotMessages);
router.post('/addBotMessage', addBotMessage);
router.post('/editBotMessage', editBotMessage);
router.post('/removeBotMessage', removeBotMessage);

router.get('/getUserMessages', getUserMessages);

router.get('/getBotSettings', getBotSettings);
router.post('/editBotSettings', editBotSettings);
router.post('/restart', restart);

module.exports = router;
/* eslint-enable */
