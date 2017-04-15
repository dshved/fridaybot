const jwt = require('jsonwebtoken');

const auth = function(req, res, next) {
  const token = req.session.token ||
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
    // return res.status(403).send({
    //   success: false,
    //   message: 'No token provided.'
    // })
    return res.redirect('/');
  }
};

module.exports = auth;
