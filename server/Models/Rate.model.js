
const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  Rate = new Schema({
    ui_ux: {
      type: Number,
      required: true
    },
    quality: {
      type: Number,
      required: true
    },
    _standing: {
      type: Number,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true,
      default: 'No comment'
    },
    _rater: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _project: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  });

Rate.pre('save', (next) => {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Rate', Rate);
