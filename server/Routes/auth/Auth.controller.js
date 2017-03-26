const { sign } = require('jsonwebtoken');
const { isValidUser } = require('../../validators/users');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { env } = require('../../config');
const { Invite, User, Cohort } = require('../../Models');

const createToken = (user) => {
  return sign(user, env.secretKey, {
    expiresIn: '24h'
  });
};

class AuthController {

  static create(req, res) {

    let errors = isValidUser(req.body);

    if (errors.length >= 1) {
      return res.status(502).json({
        error: 'Missing require parameters',
        errors
      });
    }

    let hashedPassword = hashSync(req.body.password, genSaltSync(10));

    return User
      .create({
        name: `${req.body.firstName} ${req.body.lastName}`,
        email: req.body.email,
        password: hashedPassword
      })
      .then(user => {
        let token = createToken({ _id: user._id });
        res.status(201).json({ user, token });
      })
      .catch(error => res.status(500).json(error));
  }


  static loginWithGoogle(req, res) {

    if (req.user.data && req.user.data.domain === 'andela.com') {
      return res.redirect(`/cohorts?id=${req.user.data._id}`);
    }

    return res.redirect('/');
  }

  static loginWithPassword(req, res) {
    let { email, password } = req.body;

    if (!email && !password) {
      return res.status(502)
        .json({
          message: 'Missing required paramters username and password'
        });
    }

    return User
      .findOne({ email })
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: `User of email ${email} not found`
          });
        }
        // if has invalid password
        if (!compareSync(password, user.password)) {
          return res.status(403).json({
            message: `Invalid password of account ${user.email}`
          });
        }
        let token = createToken({ _id: user._id });
        return res.status(200).json({
          user,
          token
        });
      });
  }

  static session(req, res) {

    if (!req.session.passport) {
      return res
        .status(401)
        .json({
          status: 'Unauthorized access',
          error: 'Login to have access to the api'
        });
    }

    return res.status(200).json(req.session.passport.user);
  }

  static googleAuth(accessToken, refreshToken, profile, done) {

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
    };

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
          return done(null, { data, token });
        })
        .catch(err => done(err));
    }

    // if the user has no domain
    Invite
      .findOne({ email: data.emails[0].value })
      .exec()
      .then(invite => {
        if (!invite) {
          return done(null, false, {
            message: 'Invitation not found'
          });
        }

        return User
          .findOneAndUpdate({ _id: invite._id }, update, options)
          .exec()
          .then(data => {
            return Cohort.findOneAndUpdate({
              _id: invite.cohort, _campers: { $ne: data._id }
            },
              {
                $push: { _campers: data._id }
              })
              .exec()
              .then(() => {
                let token = createToken({ _id: data._id });
                return done(null, { data, token });
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }

  static logout(req, res) {
    return req.session.destroy((error) => {
      if (error) return res.status(500).json(error);
      return res.status(200)
        .json({
          message: 'You have been logged out'
        });
    });
  }
}

module.exports = AuthController;
