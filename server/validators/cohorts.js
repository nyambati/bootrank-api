const { hasRequiredProperties } = require('./core');

function isValidCohort(cohort) {
  let required = [
    'name',
    'number',
    'capacity',
    'started_at',
    'trainers'
  ];

  return hasRequiredProperties(cohort, required);
}

module.exports = {
  isValidCohort
};
