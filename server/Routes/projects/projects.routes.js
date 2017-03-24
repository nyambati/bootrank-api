const Project = require('./projects.controller');
const Router = require('express').Router();

Router.route('/projects')
  .post(Project.create)
  .get(Project.all);

Router.route('/projects/:id')
  .get(Project.find)
  .put(Project.update)
  .delete(Project.destroy);

Router.route('/projects/:id/rating')
  .get(Project.findProjectsRating);

Router.route('/cohort/:cohort/projects')
  .get(Project.findProjectAndRating);

module.exports = Router;

