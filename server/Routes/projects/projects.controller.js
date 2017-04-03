const async = require('async');
const { Project, User } = require('../../Models');
const { isValidProject } = require('../../validators/projects');

const averageScores = (number, scores) => {
  scores.ui_ux = Math.floor(scores.ui_ux / number);
  scores.quality = Math.floor(scores.quality / number);
  scores.confidence = Math.floor(scores.confidence / number);
  scores._standing = Math.floor(scores._standing / number);
};

function projectReducer(scores) {
  let length = scores.length;

  let initialObject = {
    ui_ux: 0,
    quality: 0,
    confidence: 0,
    _standing: 0
  };

  let reducedScores = scores.reduce((sum, score) => {
    sum.ui_ux += score.ui_ux;
    sum.quality += score.quality;
    sum.confidence += score.confidence;
    sum._standing += score._standing;
    return sum;
  }, initialObject);

  return averageScores(length, reducedScores);
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

    const updateUserProjects = (userId, project) => {
      return new Promise((resolve, reject) => {
        return User
          .findByIdAndUpdate(userId, { $push: { projects: project._id } }).exec()
          .then(() => resolve(project))
          .catch(error => reject(error));
      });
    };

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
      .then(project => updateUserProjects(req.body.userId, project))
      .then(result => res.status(200).json(result))
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
            project.scores = projectReducer(project.scores);
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
          project.score = projectReducer(project.scores);
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
