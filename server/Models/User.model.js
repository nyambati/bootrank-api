let mongoose = require('mongoose');
const Schema = mongoose.Schema,
  User = new Schema({
    name: { type: String, required: true },
    gender: String,
    role: { type: String, default: 'user' },
    google_id: Number,
    email: { type: String, required: true, unique: true },
    google_plus: String,
    img_url: String,
    password: { type: String, unique: true },
    status: { type: String, default: 'active' },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    domain: { type: String },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
  });

User.pre('save', (next) => {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('User', User);
