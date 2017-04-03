module.exports = {
  hasRequiredProperties(object, required) {
    let errors = [];

    for (let prop of required) {
      if (!Object.keys(object).includes(prop)) {
        errors.push(`Missing required property ${prop}`);
      }
    }

    return errors;
  }
};


{
  name: '', age:3
}
