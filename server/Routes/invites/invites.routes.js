const Router = require('express').Router();
const Invite = require('./invites.controller');

Router.route('/invite')
  .post(Invite.create)
  .get(Invite.all);

Router.route('/invite/:id')
  .get(Invite.find)
  .put(Invite.update)
  .delete(Invite.destroy);

module.exports = Router;
