const passport = require('passport');
const AuthRouter = require('./auth/Auth.route');

module.exports = (app) => {
  app.use(AuthRouter);
  return app;
}
