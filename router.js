/* App Routes                  */
/* --------------------------- */

const passport        = require('passport');
const Auth            = require('./controllers/auth');
const passportService = require('./services/passport');

const requireAuth   = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


module.exports = function(app) {

  app.get('/', requireAuth, function(req, res) {
    res.send({ code: 0, msg: 'ok', auth: true });
  });

  app.post('/signin', requireSignin, Auth.signin);
  app.post('/signup', Auth.signup);

}

