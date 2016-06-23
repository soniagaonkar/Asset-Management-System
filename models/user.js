var mongoose = require('./../config/db');

var UserSchema = new mongoose.Schema({
    sl_ID: { type: String },
    isLoggedin:  Boolean,
    lastLogin: { type: Date, default: Date.now },
});

var loggedUser = mongoose.model('user', UserSchema);

module.exports = loggedUser;
