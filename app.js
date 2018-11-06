const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
/* eslint-disable global-require */
/* eslint import/no-unresolved: 0 */
global.DB_PATH = process.env.DB_PATH || require('./config.js').db.path;
global.BOT_TOKEN = process.env.BOT_TOKEN || require('./config.js').bot.token;
global.BOT_NAME = process.env.BOT_NAME || require('./config.js').bot.name;
global.BOT_SLACK_NAME =
  process.env.BOT_SLACK_NAME || require('./config.js').bot.slack_name;

/* eslint-enable global-require */
mongoose.Promise = global.Promise;
mongoose.connect(global.DB_PATH, {
  reconnectTries: 10,
  reconnectInterval: 1000,
});

logger.token(
  'remote-addr',
  req =>
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress,
);

const app = express();
const router = require('./server/routers/router');
const api = require('./server/routers/api');
const login = require('./server/routers/login');
const statistics = require('./server/routers/statistics');

const server = require('http').Server(app);
const io = require('socket.io')(server);

global.io = io;
/* eslint-disable */
require('./server/middlewares/socket').io;
/* eslint-enable */
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
    store: new MongoStore({ url: global.DB_PATH }),
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

app.use((req, res) => {
  res.status(404).render('error');
});

module.exports = { app, server };
