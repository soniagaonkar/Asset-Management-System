var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
    lib = require('./utils');
    config = require('./../../config/vars'),
    
    loggedUser = require( "./../../models/user" );


var dashboard = module.exports;


dashboard.login = function (req, res, next) {

    var inputData = {
        username : req.body.username,
        softLayerID : req.body.softLayerID,
        softLayerKey : req.body.softLayerKey
    }

   //to bypass
    var body = {
        "status": "success",
        "message": "You are logged in successfully"
    }
   req.loginData = body;
   req.loginData.loginSuccess = true;

   next();
}
