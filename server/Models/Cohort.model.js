'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cohorts = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: Number,
    unique: true,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  yield: {
    type: Number,
    required: false,
    default: 0
  },
  started_at: {
    type: Date,
    required: true
  },
  ended_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  trainers: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'open'
  },
  _campers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

Cohorts.pre('save', (next) => {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Cohorts', Cohorts);
