const { Invite } = require('../../Models');

class InvitesController {

  static create(req, res) {
    let update = {
      $set: {
        cohort: req.body.cohort,
        email: req.body.email
      }
    };

    let options = {
      upsert: true,
      new: true
    };

    return Invite.findByIdAndUpdate({ email: req.body.email }, update, options).exec()
      .then(invite => {
        return res.status(200).json(invite);
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  }

  static all(req, res) {
    return Invite.find({}).exec()
      .then(invites => res.status(200).json(invites))
      .catch(error => res.status(500).json(error));
  }

  static find(req, res) {

    if (!req.params.id) {
      return res.status(502).json({
        error: 'Missing required parameter id'
      });
    }

    return Invite.findById(req.params.id).exec()
      .then(invites => {

        if (!invites) {
          return res.status(404).json({
            error: 'Invite not found'
          });
        }

        res.status(200).json(invites);
      })
      .catch(error => res.status(500).json(error));
  }

  static update(req, res) {
    return Invite
      .findByIdAndUpdate(req.params.id, { $set: { cohort: req.body.cohort, email: req.body.email } }).exec()
      .then(() => {
        return res.json({
          message: 'Invitation was updated succefully'
        });
      })
      .catch(error => res.status(500).send(error));
  }

  static destroy(req, res) {
    return Invite.findByIdAndRemove(req.params.id).exec()
      .then(() => {
        return res.status(200).send({
          message: 'Invitation deleted succefully'
        });
      })
      .catch(error => res.status(500).send(error));
  }
}

module.exports = InvitesController;
