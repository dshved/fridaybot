const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token =
    req.session.token ||
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'abcdef', (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed token' });
      }
      req.decoded = decoded;
      next();
      return true;
    });
  }
  return res.redirect('/');
};

module.exports = auth;
