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
	console.log("assetsdata.length:"+assetsdata.length);
        if(assetsdata.length>0){ //found

		console.log("step1");
              req.assets = assetsdata;
            next();
          

        }else { //not  assets found

           console.log("step2");
		    next();
        }    
    });

  // next();
}

assets.addHistory = function (req, res, next) {  
	var assetId = req.body.assetId;
	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
		//assetsCollection.update({ _id: assetId },{$push: { "history": { owner: "test", assignFromDate: Date.now, assignToDate: Date.now} }},{upsert:true},
		assetsCollection.update({ _id: assetId },{$push: { "history": { owner: assetObj.currentOwner , assignFromDate: assetObj.fromDate, assignToDate: assetObj.toDate} }},{upsert:true},
			function(err, numAffected) {
			if(err) {//handle error}
				throw err;
			}
			else { 
				res.json( 200, { status: "success", message: 'Asset history updated successfully.' });
			}
		});
	});
	next();
}

assets.modifyAsset = function (req, res, next) {  
	var assetId = req.params.assetId;

	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
		if (err) throw err;
		
		var name = req.body.name;
		var description =req.body.description;
		var category = req.body.category;
		var subCategory = req.body.subCategory;
		var remarks=  req.body.remarks;
		
		if((name == "" || name == null) && (description == "" || description == null) 
		&& (category == "" || category == null) && (subCategory == "" || subCategory == null) && (remarks == "" || remarks == null) ) {
			res.json(400, { status: "failure", message: 'Provide input for one of the fields name/description/category/subcategory/remarks' });
		}

		if(!(name == "" || name == null))
			assetObj.name = name;
		if(!(description == "" || description == null))
			assetObj.description = description;
		if(!(category == "" || category == null))
			assetObj.category = category;
		if(!(subCategory == "" || subCategory == null))
			assetObj.subCategory = subCategory;
		if(!(remarks == "" || remarks == null))
			assetObj.remarks = remarks;
		
		assetObj.save(function(err) {
			if(err) {
				throw err;
			}
			else { 
				res.json( 200, { status: "success", message: 'Asset info updated successfully.' });
			}
		});
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
				if(user.role == "admin")	{
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
					message: 'Add asset not allowed for non admin user.' 
					});
				}
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