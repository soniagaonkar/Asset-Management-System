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

assets.addHistory = function (req, res, next) {  
	var assetId = req.body.assetId;
	assetsCollection.findById({ _id:assetId}, function(err, assetObj) {
		assetObj.history.push({ owner: assetObj.currentOwner, fromDate: assetObj.fromDate, toDate: assetObj.toDate});
	});
	next();
}

assets.addAsset = function (req, res, next) {    
	//fetch the token
	 var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		var decoded = jwt.decode(token, config.SECRET);
		console.log(decoded.iss);
		User.findOne({
			_id: decoded.iss
			}, function(err, user) {
			if(user)	{
				var asset = new assetsCollection({ 
				name: req.body.name, 
				description: req.body.description,
				category: req.body.category,
				subCategory: req.body.subCategory,
				remarks: req.body.remarks,
				primaryOwner: user.loginId
				});
				// save the sample user
				asset.save(function(err) {
					if (err) throw err;
					console.log("Asset added to db");
					res.json( 201, { status: "success", message: 'Asset added successfully.' });
				});
			}else	{
				return res.status(401).send({ 
				success: false, 
				message: 'Invalid auth token.' 
				});
			}
		});
		
		
	} else {
		return res.status(401).send({ 
			success: false, 
			message: 'Missing authentication token.' 
		});
	}
	next();
}