
let mongoose = require('mongoose');
const Schema = mongoose.Schema,
  Project = new Schema({
    project: {
      type: String,
      required: true
    },
    stack: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    repository: {
      type: String,
      required: true
    },
    demo: {
      type: String,
    },
    _cohort: {
      type: Schema.Types.ObjectId,
      ref: 'Cohorts'
    },
    _owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    scores: [{
      type: Schema.Types.ObjectId,
      ref: 'Rate'
    }]
  });

Project.pre('save', (next) => {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Project', Project);


