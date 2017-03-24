const jwt = require('jsonwebtoken');
const { env } = require('../../config');
const { User } = require('../../Models');


function isAuthenticated(req, res, next) {
  let token = req.headers['x-access-token'];

  if (!req.isAuthenticated && !token) {
    return res.status(403).json({
      error: 'No token provided'
    });
  }

  jwt.verify(token, env.secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        error: 'Unauthorized access, Invalid token'
      });
    }

    return User.findById(decoded._id)
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404)
            .json({
              message: 'User not found'
            });
        }
        req.decoded = user;
        next();
      })
      .catch(error => res.status(500).json(error));
  });
}

module.exports = {
  isAuthenticated
};
