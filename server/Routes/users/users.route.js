const Router = require('express').Router();
const User = require('./user.controller');

Router.route('/users')
  .get(User.all);

Router.route('/users/:id')
  .get(User.find)
  .put(User.update)
  .delete(User.delete);

Router.route('/users/:id/account')
  .put(User.deactivate);

module.exports = Router;
