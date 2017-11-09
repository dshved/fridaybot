const express = require('express');
const next = require('next');

const config = require('./config.js');

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

logger.token(
  'remote-addr',
  req =>
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress,
);

const router = require('./server/routers/router');
const api = require('./server/routers/api');
const login = require('./server/routers/login');
const statistics = require('./server/routers/statistics');

const port = parseInt(process.env.PORT, 10) || 9000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // server.set('views', path.join(__dirname, 'server/views'));
  // app.set('view engine', 'html');

  // app.use((req, res, next) => {
  //   res.io = io;
  //   next();
  // });

  // uncomment after placing your favicon in /public
  // server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  server.use(
    logger(
      ':remote-addr - :method :url :status :response-time ms - :res[content-length]',
    ),
  );
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(cookieParser());
  // server.use(express.static(path.join(__dirname, 'public')));

  server.use(
    session({
      secret: 'sdfsd3GDJD8sgahsa',
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({ url: config.db.path }),
    }),
  );

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // server.use(router);
  server.use('/login', login);
  server.use('/statistics', statistics);
  server.use('/api', api);

  // server.get('/logout', (req, res) => {
  //   req.session.destroy();
  //   res.redirect('/');
  // });

  // server.use((req, res, next) => {
  //   const err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });

  // server.use((err, req, res, next) => {
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};

  //   res.status(err.status || 500);
  //   res.render('error');
  // });

  server.get('/a', (req, res) => app.render(req, res, '/a', req.query));

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
