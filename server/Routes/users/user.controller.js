const { User } = require('../../Models');

class UserController {

  static all(req, res) {
    return User.find({}).populate('projects').exec()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(500).json(error));
  }

  static find(req, res) {
    if (req.query.role) {
      return User.findOne({ role: req.query.role })
        .populate('projects').populate('projects.scores')
        .exec()
        .then(user => {
          if (!user) {
            return res.status(404)
              .json({
                message: 'User not found'
              });
          }
          return res.status(200).json(user);
        })
        .catch(error => res.status(500).json(error));
    }
    return User.findById(req.param.id)
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404)
            .json({
              message: 'User not found'
            });
        }
        return res.status(200).json(user);
      })
      .catch(error => res.status(500).json(error));
  }

  static update(req, res) {
    let update = { $set: { role: req.body.role } };
    return User
      .findOneAndUpdate(req.params.id, update, { new: true })
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404)
            .json({
              message: 'User not found'
            });
        }
        return res.status(200).json(user);
      })
      .catch(error => res.status(500).json(error));

  }

  static deactivate(req, res) {
    let update = { $set: { status: req.body.status } };
    return User
      .findOneAndUpdate({ _id: req.params.id }, update)
      .exec()
      .then(() => {
        return res.json({
          message: 'User updated succefully'
        });
      })
      .catch(error => res.status(500).send(error));
  }

  static delete(req, res) {
    return User.findOneAndRemove(req.params.id)
      .exec()
      .then(() => {
        return res.status(200)
          .json({
            message: 'User deleted successfully'
          });
      })
      .catch(error => res.status(500).json(error));
  }
}

module.exports = UserController;
