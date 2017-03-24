function isValidProject(project) {

  let requiredProperties = [
    'owner',
    'cohort',
    'project',
    'stack',
    'descriptionn',
    'repository',
    'demo'
  ];

  let errors = [];

  for (let prop of requiredProperties) {
    if (!project.keys(project).includes(prop)) {
      errors.push(`Missing required property ${prop}`);
    }
  }

  return errors;

}


module.exports = {
  isValidProject
}
