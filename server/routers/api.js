const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const UserMessages = require('./../models/usermessage').UserMessages;
const BotMessages = require('./../models/botmessage').BotMessages;
const BotSettings = require('./../models/botsetting').BotSettings;
// const auth = require('./auth').auth;

const getBotMessages = (req, res, next) => {
  BotMessages.find({}).then((data) => {
    if (data) {
      res.send({
        msg: 'success',
        data: data,
      });
    } else {
      res.send(404);
    }
  });
};

const addBotMessage = (req, res, next) => {
  const botMessage = new BotMessages(req.body);
  botMessage.save((err, data) => {
    if (!err) {
      res.send({
        'msg': 'success',
      });
    } else {
      res.send(404);
    }
  });
};

const editBotMessage = (req, res, next) => {
  BotMessages.update({ _id: req.body.id }, { $set: req.body.params }, (err, result) => {
    if (!err) {
      res.send({
        msg: 'success',
      });
    } else {
      console.log(err);
    }
  });
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
  UserMessages.find({}).then((data) => {
    if (data) {
      res.send({
        msg: 'success',
        data: data,
      });
    } else {
      res.send(404);
    }
  });
};

const getBotSettings = (req, res, next) => {
  BotSettings.findOne({}).then((data) => {
    if (data) {
      res.send({
        msg: 'success',
        data: data,
      });
    } else {
      res.send(404);
    }
  });
};

const editBotSettings = (req, res, next) => {
  BotSettings.update({ _id: req.body.id }, { $set: req.body.params }, (err, result) => {
    if (!err) {
      res.send({
        msg: 'success',
      });
    } else {
      console.log(err);
    }
  });
};

router.get('/', (req, res) => {
  res.send('hello');
});


const auth = function(req, res, next) {
  var token = req.session.token || req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'abcdef', function(err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed token'});
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
}

router.use(auth);

router.get('/getBotMessages', getBotMessages);
router.post('/addBotMessage', addBotMessage);
router.post('/editBotMessage', editBotMessage);
router.post('/removeBotMessage', removeBotMessage);

router.get('/getUserMessages', getUserMessages);

router.get('/getBotSettings', getBotSettings);
router.post('/editBotSettings', editBotSettings);

module.exports = router;
