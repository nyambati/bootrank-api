const AuthRouter = require('./auth/Auth.route');
const UserRouter = require('./users/users.route');
const CohortRouter = require('./cohorts/cohorts.routes');
const InviteRouter = require('./invites/invites.routes');

module.exports = (app) => {

  app.use(AuthRouter);
  app.use('/api', UserRouter);
  app.use('/api', CohortRouter);
  app.use('/api', InviteRouter);

  return app;
};
