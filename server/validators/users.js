const { hasRequiredProperties } = require('./core');
function isValidUser(user) {

  let required = [
    'firstName',
    'lastName',
    'email',
    'password'
  ];

  return hasRequiredProperties(user, required);
}

module.exports = {
  isValidUser
};
