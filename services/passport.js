/* PASSPORT service            */
/* --------------------------- */

const passport      = require('passport');
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const logger        = require('winston-color');

const User          = require('../models/user');
const config        = require('../config');


/* Local Strategy        */
/* --------------------- */

// Setup options for Local Strategy
const localOptions = {
  usernameField: 'email'
};

// Create Local Strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call 'done' with the user
  // if it is the correct email and password
  // otherwise call 'done' with false
  User.findOne({ email: email }).exec(function(err, user) {
    if (err) {
      console.log(' ');
      logger.error({ err: err });
      return done(err, false);
    }
    if (!user) {
      console.log(' ');
      logger.error({ err: 'Cant find the user' });
      return done(null, false);
    }

    // compare passwords
    console.log(user)
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(' ');
        logger.error({ err: err });
        return done(err);
      }

      if (!isMatch) {
        console.log(' ');
        logger.error({ err: 'incorrect password' });
        return done(null, false);
      } else {
        console.log(' ');
        logger.info({ msg: 'User auth: ' + user.email });
        return done(null, user);
      }

    });
  });
});



/* JWT Strategy          */
/* --------------------- */

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call 'done' without a user object
  User.findById(payload.sub).exec(function(err, user) {
    if (err) {
      console.log(' ');
      logger.error({ err: err });
      return done(err, false);
    }

    if (user) {
      console.log(' ');
      logger.info({ msg: 'User auth: ' + user.email });
      done(null, user);
    } else {
      console.log(' ');
      logger.error({ err: 'Cant find the user' });
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

