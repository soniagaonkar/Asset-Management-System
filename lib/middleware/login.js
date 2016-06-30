var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
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
        // create a token for the authenticated user
		var token = jwt.encode({
			iss: user.id,
			exp: '1440m'
		}, config.SECRET);
          
        var userData = {
            "loginId": user.loginId,
            "token": token
        }
        req.session.user = userData; //set server session          
          
		//create the response json
		res.json(200,{
			"status": "success",
			"token" : token,
			"expires": '1440m'
		});
      }   
    }
	
  });
   next();
}


dashboard.logout = function (req, res, next) {
    next();
}
