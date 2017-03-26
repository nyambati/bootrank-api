const mongoErrorParser = (error) => {

  if (error.code) {
    return {
      success: false,
      error: error.errmsg
    };
  }
  /**
   * [errors description]
   * @type {Object}
   */
  let errorsToParse = error.errors;

  /**
   * [errors description]
   * @type {Object}
   */
  let parsedErrors = {};

  /**
   * [description]
   * @param  {Object} key) {errors[key] [description]
   * @return {[type]}      [description]
   */

  Object.keys(errorsToParse).forEach((key) => {
    parsedErrors[key] = {
      message: errorsToParse[key].message
    };
  });

  return parsedErrors;
};

module.exports = {
  mongoErrorParser
};
