const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const RedisStore = require('connect-redis')(session);
const Routes = require('./Routes');
const Auth = require('./Routes/auth/Auth.service');
const { connect, env } = require('./config');

class App {

  constructor() {
    this.express = express();
    this.connect(mongoose, env.db);
    this.middleware();
    this.route();
  }

  connect(mongoose, db) {
    return connect(mongoose, db);
  }

  middleware() {
    if (!env.secure) {
      this.express.use(logger('dev'));
    }
    this.express.use(helmet());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(session({
      secret: env.secretKey,
      store: new RedisStore({
        url: env.redis
      }),
      proxy: true,
      resave: true,
      saveUninitialized: false,
      cookie: {
        secure: env.secure,
        httpOnly: env.secure,
        expires: new Date(Date.now() + 60 * 60 * 1000)
      }
    }));

    Auth(env);

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.express.use(passport.initialize());
    this.express.use(passport.session());

  }

  route() {

    Routes(this.express);

    const IndexRoute = (req, res) => {
      return res.status(200)
        .json({
          status: 'online',
          host: req.headers.host,
          userAgent: req.headers['user-agent'],
          requestOrigin: req.ip
        });
    };

    this.express.get('/*', IndexRoute);
  }
}

module.exports = new App().express;
