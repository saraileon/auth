/* AUTHENTIFICATION controller */
/* --------------------------- */

const logger = require('winston-color');
const jwt    = require('jwt-simple');
const moment = require('moment');
const User   = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
  let iatStamp = moment();
  let expStamp = moment(iatStamp).add(1, 'day');
      iatStamp = new Date(iatStamp).getTime();
      expStamp = new Date(expStamp).getTime();
  delete user.password;

  return jwt.encode({ sub: user.id, iat: iatStamp, exp: expStamp, user: user }, config.secret);
}


exports.signin = (req, res, next) => {
  // User has already had ther email and pasword auth'd
  // We just need to give them a token
  const token = tokenForUser(req.user);

  console.log(' ');
  logger.info({ msg: 'User authenticated', email: req.user.username, token: token });
  res.send({ token: token })
}


exports.signup = (req, res, next) => {
  const email    = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const name     = req.body.name;

  if (!username || !password) {
    const err = 'You must provide an username & password';

    // Log event
    console.log(' ');
    logger.error({ err: err });
    return res.status(422).send({ error: err });
  }


  // See if a user with the given username exists
  User.findOne({ 'username': username }).exec((err, existingUser) => {
    if (err) {
      // Log event
      console.log(' ');
      logger.error({ err: err })

      return next(err);
    }

    // If a user with username does exist, return an error
    if (existingUser) {
      const err = 'username is in use';

      // Log event
      console.log(' ');
      logger.error({ err: err });

      return res.status(422).send({ error: err });
    }


    // Is a user with username does NOT exists, create and save user record
    const user = new User({
      username: username,
      email:    email,
      name:     name,
      password: password
    });

    // Respond to request indicating the user was created
    user.save((err, newUser) => {
      if (err) {
        // Log event
        console.log(' ');
        logger.error({ err: err })
        return next(err);
      }

      // Generete token for user
      const token = tokenForUser(user);

      // Log event
      console.log(' ');
      logger.info({ msg: 'User created', username: newUser.username, token: token });

      return res.status(200).send({ msg: 'User created', username: newUser.username, token: token });
    });
  });


}

