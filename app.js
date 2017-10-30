const config = require('./config.js');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect(config.db.path);

const app = express();
const router = require('./server/routers/router');
const api = require('./server/routers/api');
const login = require('./server/routers/login');
const statistics = require('./server/routers/statistics');

const server = require('http').Server(app);
const io = require('socket.io')(server);
global.io = io;

require('./server/middlewares/socket').io;

require('./server/bot');

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.io = io;
  next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(
  logger(
    ':remote-addr - :method :url :status :response-time ms - :res[content-length]',
  ),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'sdfsd3GDJD8sgahsa',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ url: config.db.path }),
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use('/login', login);
app.use('/statistics', statistics);
app.use('/api', api);

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server };
