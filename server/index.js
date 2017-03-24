const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
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
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(session({
      secret: env.secretKey,
      store: new MongoStore({
        url: env.db
      }),
      proxy: true,
      resave: true,
      saveUninitialized: false,
      cookie: { secure: env.secureCookie }
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
          user_agent: req.headers['user-agent'],
          request_origin: req.ip
        });
    };

    this.express.get('/*', IndexRoute);
  }
}

module.exports = new App().express;
