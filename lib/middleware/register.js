var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
    lib = require('./utils');
    config = require('./../../config/vars'),
    User = require( "./../../models/user" );

var register = module.exports;

/**
 * User registration function
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
register.addUser = function (req, res, next) {
	// validate the input data
	var username = req.body.username;
	var password = req.body.password;
	var role = req.body.role;
	var body = {
        "status": "unknown",
        "message": ""
    }
	if(username == "" || username == null || password == "" || password == null || role == "" || role == null)	{
		res.json( 403, { status: "failure", message: 'Please provide valid input.' });
	}else if(role == "admin" || role == "user")	{
		// Check if user already exists.
		User.findOne({
			loginId: username
		}, function(err, user) {

			if (err) throw err;

			if (!user) {
				// create a user object
				var newUser = new User({ 
				loginId: username, 
				password: req.body.password,
				role: role 
				});

				// save the sample user
				newUser.save(function(err) {
				if (err) throw err;

				console.log('User saved successfully');
				res.json( 201, { status: "success", message: 'User successfully registered' });
				req.registrationData = body;
				});
			} else if (user) {
				res.json( 403, { status: "failure", message: 'User already exists.' });
			}
		});
	}else {
		res.json( 403, { status: "failure", message: 'User role can be either admin or user.' });
	}
	req.registrationData = body;
	next();
}
