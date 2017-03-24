const { OAuth2Strategy } = require('passport-google-oauth');
const passport = require('passport');
const Auth = require('./Auth.controller');

const passportAuth = (env) => {
  const GoogleStrategy = new OAuth2Strategy(env.auth.google, Auth.googleAuth);
  return passport.use(GoogleStrategy);
};

module.exports = passportAuth;
