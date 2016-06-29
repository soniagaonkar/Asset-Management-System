var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
    lib = require('./utils');
    config = require('./../../config/vars'),    
	jwt = require('jwt-simple');
    assetsCollection = require( "./../../models/assets" );
	loggedInUser = require( "./../../models/user" );


var assets = module.exports;


assets.getAssets = function (req, res, next) {

    
    assetsCollection.find({ }, function(err, assetsdata) {

        if(assetsdata.length>0){ //found


              req.assets = assetsdata;
            next();
          

        }else { //not  assets found

           
        }    
    });

  // next();
}

assets.addAsset = function (req, res, next) {    
   next();
}