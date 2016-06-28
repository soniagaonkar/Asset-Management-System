var mongoose = require('./../config/db');

var UserSchema = new mongoose.Schema({
    loginId: { type: String },
	password: { type: String },
	role: { type: String },
    lastLogin: { type: Date, default: Date.now },
	createdDate: { type: Date, default: Date.now },
});

var loggedUser = mongoose.model('user', UserSchema);

module.exports = loggedUser;
