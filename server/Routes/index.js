const AuthRouter = require('./auth/Auth.route');
const UserRouter = require('./users/users.route');
const CohortRouter = require('./cohorts/cohorts.routes');
const InviteRouter = require('./invites/invites.routes');
const ProjectRouter = require('./projects/projects.routes');
const { isAuthenticated } = require('./middlewares');

module.exports = (app) => {
  let prefix = '/api';

  app.use(AuthRouter);
  app.use(prefix, isAuthenticated);
  app.use(prefix, UserRouter);
  app.use(prefix, CohortRouter);
  app.use(prefix, InviteRouter);
  app.use(prefix, ProjectRouter);

  return app;
};
