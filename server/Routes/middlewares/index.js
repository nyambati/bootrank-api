const jwt = require('jsonwebtoken');
const { env } = require('../../config');
const { User } = require('../../Models');


const verifyUserToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, secretKey, (error, decoded) => {
      if (error) return reject(error);
      return resolve(decoded);
    });
  });
};

const isAuthenticated = (req, res, next) => {

  let token = req.headers['x-access-token'];

  if (!req.isAuthenticated && !token) {
    return res.status(403).json({
      error: 'No token provided'
    });
  }

  return verifyUserToken(token, env.secretKey)
    .then(decoded => {
      return User.findById(decoded._id).exec();
    })
    .then(user => {
      if (!user) {
        return res.status(404)
          .json({
            message: 'User not found'
          });
      }
      req.decoded = user;
      next();
    }).catch(error => {
      return res.status(403).send({
        errorMessage: 'Unauthorized access, Invalid token', error
      });
    });
};

module.exports = {
  isAuthenticated
};
