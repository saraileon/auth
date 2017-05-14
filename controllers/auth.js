/* AUTHENTIFICATION controller */
/* --------------------------- */

const logger = require('winston-color');
const jwt		 = require('jwt-simple');
const User 	 = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signin = (req, res, next) => {
	// User has already had ther email and pasword auth'd
	// We just need to give them a token
	const token = tokenForUser(req.user);

	console.log(' ');
	logger.info({status: 200, msg: 'User authenticated', email: req.user.email, token: token });
	res.send({ token: token })
}


exports.signup = (req, res, next) => {
	const email 	 = req.body.email;
	const password = req.body.password;

	if( !email || !password ){
		const err = 'You must provide an email & password';

		// Log event
		console.log(' ');
		logger.error({status: 422, err: err});
		return res.status(422).send({status: 422, error: err});
	}


	// See if a user with the given email exists
	User.findOne({'email':email}).exec((err,existingUser) => {
		if( err ) {
			// Log event
			console.log(' ');
			logger.error({err: err})

			return next(err);
		}

		// If a user with email does exist, return an error
		if( existingUser ){
			const err = 'Email is in use';

			// Log event
			console.log(' ');
			logger.error({status: 422, err: err});

			return res.status(422).send({status: 422, error: err});
		}


		// Is a user with email does NOT exists, create and save user record
		const user = new User({
			email: email,
			password: password
		});

		// Respond to request indicating the user was created
		user.save((err, newUser) => {
			if( err ) {
				// Log event
				console.log(' ');
				logger.error({err: err})
				return next(err);
			}

			// Generete token for user
			const token = tokenForUser(user);

			// Log event
			console.log(' ');
			logger.info({status: 200, msg: 'User created', email: newUser.email, token: token });

			return res.status(200).send({msg: 'User created', email: newUser.email, token: token });
		});
	});


}


