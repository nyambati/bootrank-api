const jwt = require('jsonwebtoken');
const { env } = require('../../config');
const { Invite, User } = require('../../Models');

class AuthController {

  static login(req, res) {

    if (req.user.data && req.user.data.domain === 'andela.com') {
      return res.redirect(`/cohorts?id=${req.user.data._id}`)
    }

    return res.redirect(`/`);
  }
  static googleAuth(accessToken, refreshToken, profile, done) {
    const createToken = (user) => {
      return jwt.sign(user, env.secretKey, {
        expiresIn: "24h"
      });
    };

    let data = profile._json;
    let update = {
      $set: {
        name: data.displayName,
        gender: data.gender,
        google_id: data.id,
        email: data.emails[0].value,
        google_plus: data.url,
        img_url: data.image.url.replace(/\?sz=50/, ''),
        domain: data.domain
      }
    }

    let options = {
      new: true,
      upsert: true
    };
    // if the user has an andela mail
    if (data.domain === 'andela.com') {
      return User
        .findOneAndUpdate({ google_id: data.id }, update, options)
        .exec()
        .then(data => {
          let token = createToken({ _id: data._id });
          return done(null, { data, token })
        })
        .catch(err => done(err));
    }

    // if the user has no domain
    console.log(data)
    Invite
      .findOne({ email: data.emails[0].value })
      .exec()
      .then(invite => {
        if (!invite) {
          return done(null, {
            message: "Invitation not found"
          })
        }

        return User
          .findOneAndUpdate({ _id: invite._id }, update, options)
          .exec()
          .then(data => {
            return Cohort.update(
              {
                _id: invite.cohort, _campers: { $ne: user_data._id }
              },
              {
                $push: {
                  _campers: user_data._id
                }
              })
              .exec()
              .then(ok => {
                let token = createToken({ _id: data._id });
                return done(null, { data, token })
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }
}

module.exports = AuthController
