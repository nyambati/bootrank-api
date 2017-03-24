const Router = require('express').Router();
const Cohort = require('./cohorts.controller');

Router.route('/cohorts')
  .post(Cohort.create)
  .get(Cohort.all);

Router.route('/cohorts/:id')
  .get(Cohort.find)
  .put(Cohort.update)
  .patch(Cohort.archive)
  .delete(Cohort.destroy);

module.exports = Router;
