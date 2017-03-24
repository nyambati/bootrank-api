const { Cohort } = require('../../Models');
const { isValidCohort } = require('../../validators/cohorts');

class CohortsController {

  static create(req, res) {
    let errors = isValidCohort(res.body);
    if (errors) {
      return res.status(502).json({
        error: 'Missing parameters',
        errors
      });
    }

    return new Cohort(req.body).save()
      .then(cohort => {
        return res.status(201).json(cohort);
      })
      .catch(error => {
        return res.status(500).json(error);
      });

  }

  static all(req, res) {
    return Cohort.find({}).populate('_campers').exec()
      .then(cohorts => {
        return res.status(200).json(cohorts);
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  }

  static find(req, res) {
    if (!req.params.id) {
      return res.status(502).json({
        error: 'Missing required parameter id'
      });
    }
    return Cohort.findById(req.params.id).exec()
      .then(cohort => {
        if (!cohort) {
          return res.status(404)
            .json({
              message: 'Cohort not found'
            });
        }

        return res.status(200).json(cohort);
      });
  }

  static update(req, res) {
    if (!req.params.id) {
      return res.status(502).json({
        error: 'Missing required parameter id'
      });
    }

    let update = {
      $set: {
        name: req.body.name,
        number: req.body.number,
        capacity: req.body.capacity,
        yeild: req.body.yeild,
        started: req.body.started,
        ended: req.body.ended,
        status: req.body.status,
        trainers: req.body.trainers
      }
    };

    if (req.query.close) {
      return Cohort
        .findOneAndUpdate(req.params.id, { $set: { status: 'closed', closed_at: new Date() } })
        .exec()
        .then(cohort => {
          return res.status(204).json(cohort);
        })
        .catch(error => res.status(500).json(error));
    }

    return Cohort
      .findByIdAndUpdate(req.params.id, update, { new: true }).exec()
      .then(cohort => {
        return res.status(204).json(cohort);
      })
      .catch(error => res.status(500).json(error));
  }

  static archive(req, res) {
    if (!req.params.id) {
      return res.status(502).json({
        error: 'Missing required parameter id'
      });
    }

    return Cohort
      .findByIdAndUpdate(req.params.id, { $set: { archived: true, closed_at: new Date() } }).exec()
      .then(cohort => {
        return res.status(204).json(cohort);
      })
      .catch(error => res.status(500).json(error));
  }

  static destroy(req, res) {
    if (!req.params.id) {
      return res.status(502).json({
        error: 'Missing required parameter id'
      });
    }

    return Cohort
      .findByIdAndRemove(req.params.id).exec()
      .then(() => {
        return res.status(204).json({
          message: 'Invitation deleted succefully'
        });
      })
      .catch(error => res.status(500).json(error));
  }
}

module.exports = CohortsController;
