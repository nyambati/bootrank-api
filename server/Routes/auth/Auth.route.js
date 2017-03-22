const Router = require('express').Router();
const passport = require('passport');
const Auth = require('./Auth.controller')

let scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/userinfo.profile'
];

Router.route('/auth/google')
  .get(passport.authenticate('google', { scope }))


Router.route('/auth/google/callback')
  .get(passport.authenticate('google', { failureRedirect: '/login' }), Auth.login);

Router.route('/auth/session')
  .get((req, res) => {
    if (!req.session.passport) {
      return res
        .status(401)
        .json({
          status: 'Unauthorized access',
          error: 'Login to have access to the api'
        });
    }

    return res
      .status(200)
      .json(req.session.passport.user)

  })


module.exports = Router
