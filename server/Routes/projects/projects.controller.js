const async = require('async');
const { Project, User } = require('../../Models');
const { isValidProject } = require('../../validators/projects');

function projectScores(scores) {
  let computedScores = {
    ui_ux: 0,
    quality: 0,
    confidence: 0,
    _standing: 0
  };

  for (let score of scores) {
    computedScores.ui_ux += score.ui_ux;
    computedScores.quality += score.quality;
    computedScores.confidence += score.confidence;
    computedScores._standing += score._standing;
  }

  computedScores.ui_ux = Math.floor(computedScores.ui_ux / len);
  computedScores.quality = Math.floor(computedScores.quality / len);
  computedScores.confidence = Math.floor(computedScores.confidence / len);
  computedScores._standing = Math.floor(computedScores._standing / len);

  return computedScores;
}

class ProjectsController {
  static create(req, res) {
    let errors = isValidProject(req.body);

    if (errors) {
      return res.status(502).json({
        error: 'Missing required paramters',
        errors
      });
    }

    return Project
      .create({
        _owner: req.decoded._id,
        _cohort: req.body._cohort,
        project: req.body.project,
        stack: req.body.stack,
        description: req.body.description,
        repository: req.body.repository,
        demo: req.body.demo
      })
      .then(project => {
        return User
          .findByIdAndUpdate(req.body.user_id, { $push: { projects: project._id } }).exec()
          .then(() => {
            res.status(201).json(project);
          })
          .catch(error => res.status(500).json(error));
      })
      .catch(error => res.status(500).json(error));
  }

  static all(req, res) {
    return Project.find({}).populate('_owner').populate('scores').exec()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(500).json(error));
  }

  static findProjectsRating(req, res) {
    if (!req.params.cohort) {
      return res.status(502).json({
        error: 'Missing required parameters cohort id'
      });
    }

    return Project.find({ _cohort: req.params.cohortId, _owner: req.decoded._id })
      .select('_cohort project scores _owner')
      .populate('scores').populate('_owner').exec()
      .then(projects => {
        function mapProjectScores(callback) {
          for (let project of projects) {
            project.scores = projectScores(project.scores);
          }
          callback(null, projects);
        }
        async.waterfall([mapProjectScores], (error, result) => {
          if (error) return res.status(500).json(error);
          return res.status(200).json(result);
        });
      })
      .catch(error => res.status(500).json(error));
  }

  static findProjectAndRating(req, res) {
    return Project.findById(req.params.id).populate('scores').exec()
      .then(project => {

        if (!project) {
          return res.status(404).send({ message: 'Project not found' });
        }
        const mapProjectScore = (callback) => {
          project.score = projectScores(project.scores);
          callback(null, project);
        };

        async.waterfall([mapProjectScore], (error, result) => {
          if (error) return resizeBy.status(500).json(error);
          return resizeBy.status(200).json(result);
        });

      })
      .catch(error => res.status(500).json(error));
  }

  static find(req, res) {
    if (!req.params.id) {
      return res.status(502).json({
        message: 'Missing required parameter project id'
      });
    }

    return Project
      .findById(req.params.id).populate('_owner').populate('scores').exec()
      .then(project => {
        if (!project) {
          return res.status(404).json({
            message: 'Project not found'
          });
        }
        return res.status(200).json(project);
      });
  }

  static update(req, res) {

    if (!req.params.id) {
      return res.status(502).json({
        message: 'Missing required parameter project id'
      });
    }

    let update = {
      $set: {
        _owner: req.decoded._id,
        _cohort: req.body._cohort,
        project: req.body.project,
        stack: req.body.stack,
        description: req.body.description,
        repository: req.body.repository,
        demo: req.body.demo
      }
    };

    return Project.findOneAndUpdate({ _id: req.params.id, _owner: req.decoded._id }, update)
      .exec()
      .then(() => {
        return res.status(204).json({
          message: 'project was updated successfully'
        });
      })
      .catch(error => res.status(500).json(error));
  }

  static destroy(req, res) {
    if (!req.params.id) {
      return res.status(502).json({
        message: 'Missing required parameter project id'
      });
    }

    return Project.findOneAndRemove({ _id: req.params.id, _owner: req.decoded._id }).exec()
      .then(() => {
        return res.status(200)
          .send({
            message: 'Project deleted succefully'
          });
      })
      .catch(error => res.status(500).json(error));
  }
}


module.exports = ProjectsController;
