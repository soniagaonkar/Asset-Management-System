var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
    lib = require('./utils');
    config = require('./../../config/vars'),    
	jwt = require('jwt-simple');
    assetsCollection = require( "./../../models/assets" );
	loggedInUser = require( "./../../models/user" );
	requests = require( "./../../models/requests" );


var assets = module.exports;


assets.getAssets = function (req, res, next) {

    var type = req.param("type") ? req.param("type") : "";
    
    assetsCollection.find({ }, function(err, assetsdata) {
	   
        console.log("assetsdata.length:"+assetsdata.length);
        
        if(assetsdata.length>0){ //found

            req.assets = assetsdata;                
            var filteredAssets = assetsdata;            
            if(type=="free") {
                filteredAssets = _.where(assetsdata, {isFree: true});
            }else if(type=="owned"){
                if(req.session.user)
                    filteredAssets = _.where(assetsdata, {primaryOwner: req.session.user.loginId});
                else
                    filteredAssets = "";
                
            } else if(type=="assigned"){
                 if(req.session.user)
                    filteredAssets = _.where(assetsdata, {currentOwner: req.session.user.loginId});
                else
                    filteredAssets = "";            
            }                  

            req.assets = filteredAssets;
            next();
          

        }else { //not  assets found
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
	if(req.authUser && req.authUser.role == "admin")	{
		var asset = new assetsCollection({ 
		name: req.body.name, 
		description: req.body.description,
		category: req.body.category,
		subCategory: req.body.subCategory,
		remarks: req.body.remarks,
		primaryOwner: req.authUser.loginId
		});
		// save the asset
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
			
}


assets.deleteAsset = function (req, res, next) {
	var assetId = req.params.assetId;
	var disable  = req.body.disable ;
	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
		if (err) throw err;
		if(disable == "yes"){
			//Do a soft delete
			assetObj.isDeleted = true;
			assetObj.save(function(err) {
				if(err) 
					throw err;
				else { 
					res.json( 200, { status: "success", message: 'Asset is disabled.' });
				}
			});
		}else	{
			assetsCollection.findOneAndRemove({ _id:assetId},function(err){
				if(err) 
					throw err;
				else { 
					res.json( 200, { status: "success", message: 'Asset is deleted.' });
				}
			});
		}
	});
	next();
}

assets.assignAsset = function (req, res, next) {

	var fromDate = req.body.fromDate;
	var toDate = req.body.toDate;
	//Check user role is admin
	if(req.authUser && req.authUser.role == "admin")	{
		var assetId = req.params.assetId;
		//check for valid assetId
		assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
			
			if (err) throw err;
			else if(assetObj.primaryOwner == req.authUser.loginId)	{ //check logged user is the assetPrimaryOwner
				//Check if assignTo is a valid user.
				User.findOne({
				loginId: req.body.assignTo
				}, function(err, user) {
					if(err) 
								throw err;
					if(user) {
						//Check if the asset is assigned to any user.
						if(assetObj.currentOwner != null || assetObj.currentOwner != "")	{
							//update history info.
							assetsCollection.update({ _id: assetId },{$push: { "history": { owner: assetObj.currentOwner , assignFromDate: assetObj.fromDate, assignToDate: assetObj.toDate} }},{upsert:true},
								function(err, numAffected) {
								if(err) 
									throw err;
								else { 
									console.log("Asset:" + assetId + "history updated successfully." );
								}
							});
						}else	{
							console.log("Asset:" + assetId + " doesn't have a currentOwner.");
						}
						//update asset obj
						//assetObj.fromDate = Date.now ;
						//assetObj.toDate = Date.now;
						assetObj.remarks = req.body.remarks;
						assetObj.save(function(err) {
							if(err) 
								throw err;
							else { 
								res.json( 200, { status: "success", message: 'Asset assignment updated successfully.' });
							}
						});
					}
					else	{
						return res.status(404).send({ 
						success: false, 
						message: 'Non existing user: ' +  req.body.assignTo
						});
					}
				});
			}
			else	{
				return res.status(401).send({ 
						success: false, 
						message: 'Logged in user: ' +  req.authUser.loginId + ' is not the asset primary owner.'
				});
			}
		});
	}else	{
		return res.status(401).send({ 
		success: false, 
		message: 'Assign asset not allowed for non admin user.' 
		});
	}
}


assets.requestAsset = function (req, res, next) {
	var assetId = req.params.assetId;	
	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
		if (err) throw err;
		var newRequest = new requests({ 
			assetId: assetId, 
			message: req.body.message,
			duration: req.body.duration,
            durationRange: req.body.durationRange,
			requestorId: req.authUser.loginId,
			primaryOwnerId: assetObj.primaryOwner
		});
		newRequest.save(function(err) {
			if (err) throw err;
			console.log('Request saved successfully');
			res.json( 201, { status: "success", message: 'Request registered' });
		});
	});
	next();
}



assets.viewRequests = function (req, res, next) {
    
    if(req.authUser && req.authUser.role == "admin") {

        requests.find({ primaryOwnerId: req.authUser.loginId}, function(err, requestList) {
            if (err) throw err;
            if(requestList.length>0){
                console.log("requestList:" +requestList.length);
                
                async.waterfall([
                    function(callback) {
                        var assetsArr = []
                            _.each(requestList, function( eachReq, key ) {
                                assetsArr.push(eachReq.assetId);
                            });
                        callback(null, assetsArr);
                    },
                
                    function(assetsArr, callback) {
                        assetsCollection.find( { _id: { $in: assetsArr } } , function(err, assetData) {
                                callback(null, assetData);                
                        });
                    },
                
                    function(assetData, callback) {
                        var newRequestArr = []
                        _.each(requestList, function( eachReq, key ) {                                  
                            var requestsJson = {};
                            requestsJson.request = eachReq;
                            _.each(assetData, function( eachAsset, key ) {                                   
                                if(eachAsset._id == eachReq.assetId){                                    
                                    requestsJson.asset =  eachAsset;                                       
                                    newRequestArr.push(requestsJson);
                                }                                   
                            });                    
                        });
                        callback(null, newRequestArr);
                    }
                ], function (err, newRequestArr) {
                    req.requests = newRequestArr;
                    next(); 
                });
                
            }else	{
                req.reqData ={};
                console.log("No requests assigned to user");
            }
        });
    }else	{
        console.log("User not authorized");
    }		
}


/*assets.viewRequests = function (req, res, next) {
    
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		var decoded = jwt.decode(token, config.SECRET);
		console.log(decoded.iss);
		User.findOne({
			_id: decoded.iss
			}, function(err, user) {
			if(user && user.role == "admin")	{
				requests.find({ primaryOwnerId: user.loginId}, function(err, requestList) {
					if (err) throw err;
					if(requestList.length>0){
					console.log("requestList:" +requestList.length);
						res.json( 201, {"requests":requestList});
						next();
					}else	{
						req.reqData ={};
						console.log("No requests assigned to user");
					}
				});
			}else	{
				console.log("User not authorized");
			}
		});
	}else	{
		return res.status(401).send({ 
		success: false, 
		message: 'Invalid auth token.' 
		});
	}
	next();
}*/


assets.getAssetbyId = function (req, res, next) {
    
    var assetId = req.param("assetId") ? req.param("assetId") : "";
    
    if(assetId) {
        assetsCollection.find({ "_id": assetId}, function(err, assetdata) {            
            req.assets = assetdata;            
            next();
        });    
    }else{
        req.assets = "";
        next();
    }    
}
