function isValidCohort(cohort) {
  let requiredProperties = [
    'name',
    'number',
    'capacity',
    'started_at',
    'trainers'
  ];

  let errors = [];

  for (let prop of requiredProperties) {
    if (!Object.getOwnPropertyNames(cohort).includes(prop)) {
      errors.push(`Missing required property ${prop}`);
    }
  }

  return errors;

}


module.exports = {
  isValidCohort
};
