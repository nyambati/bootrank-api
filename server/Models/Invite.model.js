const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Invites = new Schema({
  cohort: {
    type: Schema.Types.ObjectId,
    ref: 'Cohorts'
  },
  email: {
    type: String,
    unique: true,
    required: true
  }
});

Invites.pre('save', (next) => {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Invites', Invites);
