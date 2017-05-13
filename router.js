/* App Routes									 */
/* --------------------------- */

const passport				= require('passport');
const Auth 						= require('./controllers/auth');
const passportService = require('./services/passport');

const requireAuth 	= passport.authenticate('jwt', { session:false });
const requireSignin = passport.authenticate('local', { session:false });


module.exports = function(app) {

	// app.get('/', (req, res, next) => {
	// 	return res.send({code:0,msg:'ok'});
	// });
	app.get('/', requireAuth, function(req, res) {
		res.send({hi:'there'});
	});

	app.post('/signin', requireSignin, Auth.signin);
	app.post('/signup', Auth.signup);

}



