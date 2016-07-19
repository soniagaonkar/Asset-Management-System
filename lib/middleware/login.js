var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
	moment = require('moment'),
    lib = require('./utils');
    config = require('./../../config/vars'),
    jwt = require('jwt-simple');
    loggedUser = require( "./../../models/user" );


var dashboard = module.exports;

/**
 * Login function
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
dashboard.login = function (req, res, next) {    
   
  // find the user in db
  User.findOne({
    loginId: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
	  res.json( 404,{
		"status": "failure",
        "message": "Authentication failed. User not found."
	  });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
		  res.json( 401,{
			"status": "failure",
			"message": "Authentication failed. Wrong password."
		  });
      } else {
		//Set token expiry to 1 day.
		var expires = moment().add(1,'days').valueOf();
        // create a token for the authenticated user
		var token = jwt.encode({
			iss: user.id,
			exp: expires
		}, config.SECRET);
          
        var userData = {
            "loginId": user.loginId,
            "token": token
        }
       // req.session.user = userData; //set server session          
          
		//create the response json
		res.json(200,{
			"status": "success",
            "loginId": user.loginId,
            "role": user.role,
			"token" : token,
			"expires": expires
		});
      }   
    }	
  });
}


dashboard.logout = function (req, res, next) {
    req.session.destroy(function(err) {
      if (err) console.log(err);
      next();
    })   
}


dashboard.apiUrl = function (req, res, next) {
    req.HOST_URL = config.HOST_URL;
    next();
}