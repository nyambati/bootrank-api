const { hasRequiredProperties } = require('./core');
function isValidProject(project) {

  let required = [
    'owner',
    'cohort',
    'project',
    'stack',
    'descriptionn',
    'repository',
    'demo'
  ];

  return hasRequiredProperties(project, required);
}

module.exports = {
  isValidProject
};
