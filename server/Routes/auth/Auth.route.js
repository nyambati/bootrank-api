const Router = require('express').Router();
const passport = require('passport');
const Auth = require('./Auth.controller');

let scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/userinfo.profile'
];

Router.route('/auth/google')
  .get(passport.authenticate('google', { scope }));

Router.route('/auth/google/callback')
  .get(passport.authenticate('google', { failureRedirect: '/login' }), Auth.loginWithGoogle);

Router.route('/auth/session')
  .get(Auth.session);

Router.route('/auth/signup')
  .post(Auth.create);

Router.route('/auth/login')
  .post(Auth.loginWithPassword);

Router.route('/auth/logout')
  .get(Auth.logout);

module.exports = Router;
