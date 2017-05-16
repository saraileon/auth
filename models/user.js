/* User model 								 */
/* --------------------------- */

const mongoose = require('mongoose');
const bcrypt 	 = require('bcrypt');
const Schema 	 = mongoose.Schema;


const userSchema = new Schema({
	email: 		{ type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  name:     { type: String },
	password: { type: String }
});


userSchema.pre('save', function(next) {
	const user = this;

	// only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

	// generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using the salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the plain text password with the encrypted password
      user.password = hash;
      next();
    });
  });
});


userSchema.methods.comparePassword = function(candidatePassword, callback) {
	const user = this;
	bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
		if(err) return callback(err);

		callback(null, isMatch);
	});
};

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;

