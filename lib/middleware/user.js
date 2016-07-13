var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
    lib = require('./utils');
    config = require('./../../config/vars'),
    User = require( "./../../models/user" );

var user = module.exports;

/**
 * User registration function
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
user.getUsers = function (req, res, next) {
	
    User.find({ }, function(err, userdata) {

        console.log("UUUUUUUUUUUUUUUUU");
        
        console.log("Users .length: "+userdata.length);        
        req.users = userdata;
        next();

    });
}
