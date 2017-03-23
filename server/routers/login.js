const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const User = require('../models/usermessage').UserMessages;
const Auth = require('../middlewares/auth');

router.get('/', function(req, res) {
  res.redirect('/');
  // res.json({ message: 'Welcome to the cooest API on earth!' });
})


router.post('/', function (req, res, next) {
  var name = req.body.name;

  var token = req.session.token || req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'abcdef', function(err, decoded) {
      if (err) {
        return next(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {

    User.findOne( { user_name: name }, function (err, user) {
      if (err) return next(err);

      if (!user) {
        res.status(400);
        res.write('email или пароль неверен');
        res.end();
      } else {
        token = jwt.sign(user, 'abcdef', {
          expiresIn: 60*60*24*7
        });
        res.status(200);
        req.session.token = token;
        res.redirect('/');
        res.end();
      }
    })
  };
});


router.use(Auth);

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
})




module.exports = router;

