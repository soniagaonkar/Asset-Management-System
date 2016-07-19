var _ = require('underscore'),
    request = require('request'),
    async = require('async'),
    lib = require('./utils');
	moment = require('moment');
    config = require('./../../config/vars'),    
	jwt = require('jwt-simple');
    assetsCollection = require( "./../../models/assets" );
	loggedInUser = require( "./../../models/user" );
	requests = require( "./../../models/requests" );


var assets = module.exports;

/**
The getAssets method would return asset list based on asset type = free/owned/all
*/
assets.getAssets = function (req, res, next) {

    var type = req.param("type") ? req.param("type") : "";
	var primaryOwnerId = req.param("primaryOwnerId") ? req.param("primaryOwnerId") : "";
    
    assetsCollection.find({ }, function(err, assetsdata) {
	   
        console.log("assetsdata.length:"+assetsdata.length);
        
        if(assetsdata.length>0){ //found

            req.assets = assetsdata;                
            var filteredAssets = assetsdata;            
            if(type=="free") {
                filteredAssets = _.where(assetsdata, {isFree: true});
            }else if(primaryOwnerId != ""){
				filteredAssets = _.where(assetsdata, {primaryOwner: primaryOwnerId});
			}else if(type=="owned"){
				//Check for admin user.
                if(req.session.user && req.authUser && req.authUser.role == "admin")
                    filteredAssets = _.where(assetsdata, {primaryOwner: req.authUser.loginId});
                else	{
                    filteredAssets = "";
					return res.status(401).send({ 
					success: false, 
					message: 'View owned assets not allowed for non admin user.' 
					});
				}
                
            } else if(type=="assigned"){
                filteredAssets = _.where(assetsdata, {currentOwner: req.authUser.loginId});      
            }                  

            req.assets = filteredAssets;
            next();
          

        }else { //not  assets found
		    next();
        }    
    });

}

/**
The getAssignedAssets method would return asset assigned to logged in user.
*/
assets.getAssignedAssets = function (req, res, next) {
	console.log("here..");
    assetsCollection.find({ currentOwner: req.authUser.loginId }, function(err, assetsdata) {
        console.log("assetsdata.length:"+assetsdata.length);
        if(assetsdata.length>0){ //found
            req.assets = assetsdata;                
            next();
        }else { //not  assets found
		    next();
        }    
    });
}

assets.addHistory = function (req, res, next) {  
	var assetId = req.body.assetId;
	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
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

/**
The modifyAsset method would update asset name/description/category/subcategory/remarks.
*/
assets.modifyAsset = function (req, res, next) {  
	var assetId = req.params.assetId;
	//Check user role is admin
	if(req.authUser && req.authUser.role == "admin")	{
		assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
			if (err) {
				console.log(err);
				res.json(400,{ status: "failure", message: err });
			}
			else	{
				var name = req.body.name;
				var description =req.body.description;
				var category = req.body.category;
				var subCategory = req.body.subCategory;
				var remarks=  req.body.remarks;
				//validate input data.
				if((name == "" || name == null) && (description == "" || description == null) 
				&& (category == "" || category == null) && (subCategory == "" || subCategory == null) && (remarks == "" || remarks == null) ) {
					res.json(400, { status: "failure", message: 'Provide input for one of the fields name/description/category/subcategory/remarks' });
				}
				else {
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
							res.json(500,{ status: "failure", message: err });
						}
						else { 
							console.log("Asset info updated successfully.");
							res.json( 200, { status: "success", message: 'Asset info updated successfully.' });
						}
					});
				}
			}
		});
	}
	else	{
		return res.status(401).send({ 
		status: "failure", 
		message: 'Modify asset not allowed for non admin user.' 
		});
	}
}

/**
The addAsset method would add a new asset.
*/
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
			if (err) {
				res.json(500,{ status: "failure", message: err });
			}else{
				console.log("Asset added to db:" + asset._id);
				res.json( 201, { status: "success", message: 'Asset:'+ asset._id +' added successfully.' });
			}
		});
	}else	{
		return res.status(401).send({ 
		success: false, 
		message: 'Add asset not allowed for non admin user.' 
		});
	}
			
}

/**
The deleteAsset method would delete a asset.
If disable=yes then its a soft delete or hard delete.
*/
assets.deleteAsset = function (req, res, next) {
	var assetId = req.params.assetId;
	var disable  = req.body.disable ;
	//Check user role is admin
	if(req.authUser && req.authUser.role == "admin")	{
		assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
			if (err) 
				res.json(400,{ status: "failure", message: err });
			else if(assetObj.primaryOwner != req.authUser.loginId)	{
				return res.status(401).send({ 
							status: "failure", 
							message: 'Logged in user: ' +  req.authUser.loginId + ' is not the asset primary owner.'
					});
			}
			else	{
				if(disable == "yes"){
					//Do a soft delete
					assetObj.isDeleted = true;
					assetObj.save(function(err) {
						if(err) 
							res.json(500,{ status: "failure", message: err });
						else { 
							res.json( 200, { status: "success", message: 'Asset is disabled.' });
						}
					});
				}else	{
					assetsCollection.findOneAndRemove({ _id:assetId},function(err){
						if(err) 
							res.json(500,{ status: "failure", message: err });
						else { 
							res.json( 200, { status: "success", message: 'Asset is deleted.' });
						}
					});
				}
			}
		});
	}else	{
		return res.status(401).send({ 
		success: false, 
		message: 'Delete asset not allowed for non admin user.' 
		});
	}
	
}

/**
The assignAsset method would assign a asset to a user and 
would also update request status to Accepted if requestId is passed as a parameter.
*/
assets.assignAsset = function (req, res, next) { 

	//validate date fields.
	var fromDate = moment(req.body.fromDate, 'M/D/YYYY');
	var toDate =  moment(req.body.toDate, 'M/D/YYYY');
	var diffDays = toDate.diff(fromDate, 'days');
	
	console.log("from:" + fromDate.format('M/D/YYYY') + " to:" + toDate + " diffDays:" + diffDays );
	//validate date input.
	if(diffDays < 0 ){
		return res.status(403).send({ 
			status: "failure", 
			message: 'Inavalid fromDate and toDate.'
			});
	}
	//Check user role is admin
	if(req.authUser && req.authUser.role == "admin")	{
		var assetId = req.params.assetId;
		//check for valid assetId
		assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
			if (err) 
				res.json(500,{ status: "failure", message: err });
			else if(!assetObj)	{
				res.json( 400,{
				"status": "failure",
				"message": "Invalid assetId."
			  });
			}
			else if(assetObj.isDeleted == true)	{
				return res.status(403).send({ 
						status: "failure", 
						message: "Asset:" + assetId + " is disabled." 
						});
			}
			
			else if(assetObj.primaryOwner == req.authUser.loginId)	{ //check logged user is the assetPrimaryOwner
				//Check if assignTo is a valid user.
				User.findOne({
				loginId: req.body.assignTo
				}, function(err, user) {
					if(err) 
						res.json(500,{ status: "failure", message: err });
					else if(user) {
						//Check if the asset is assigned to any user.
						if(assetObj.currentOwner == undefined)
							console.log("Asset:" + assetId + " doesn't have a currentOwner.");
						else {
							console.log("Asset:" + assetId + " ,currentOwner:" + assetObj.currentOwner);
							//update history info.
							assetsCollection.update({ _id: assetId },{$push: { "history": { owner: assetObj.currentOwner , assignFromDate: assetObj.fromDate, assignToDate: assetObj.toDate} }},{upsert:true},
								function(err, numAffected) {
								if(err) 
									console.log("Asset:" + assetId + ",error occurred updating history." + err);
								else { 
									console.log("Asset:" + assetId + "history info updated successfully." );
								}
							});
						}
						assetObj.fromDate = req.body.fromDate;
						assetObj.toDate = req.body.toDate;
						assetObj.currentOwner = req.body.assignTo;
						assetObj.remarks = req.body.remarks;
						assetObj.recUpdatedDate = moment();
						assetObj.isfree = false;
						assetObj.save(function(err) {
							if(err) {
								console.log(err);
								res.json( 500, { status: "failure", message: 'Error' });
							}
							else { 
								//If request info is present then update request status.
								var requestId = req.param("requestId") ;
								if(requestId){
                                    requests.update({ _id: requestId, assetId: assetId },{status:"Accepted"},{upsert:true},
                                        function(err, numAffected) {
                                        if(err) {
                                            res.json( 500, { status: "failure", message: 'Error' });
                                        }
                                        else { 
                                            console.log("RequestId:" + requestId + " accepted successfully." );
                                            res.json( 200, { status: "success", message: 'Asset assignment and request status updated successfully.' });
                                        }
                                    });
                                   
                                }else { 
									console.log("Asset:" + assetId +" assigned successfully." );
									res.json( 200, { status: "success", message: 'Asset assigned successfully.' });
                                }
							}
						});
					}
					else	{
						return res.status(403).send({ 
						status: "failure", 
						message: 'Non existing user: ' +  req.body.assignTo
						});
					}
				});
			}
			else	{
				return res.status(401).send({ 
						status: "failure", 
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

/**
The requestAsset method user will place a request for an asset.
*/
assets.requestAsset = function (req, res, next) {
	var assetId = req.params.assetId;	
	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
		if (err) 
			res.json(400,{ status: "failure", message: err });
		else	{
			if(req.body.durationRange == "weeks" || req.body.durationRange == "months" || req.body.durationRange == "days")	{
				var newRequest = new requests({ 
					assetId: assetId, 
					message: req.body.message,
					duration: req.body.duration,
					durationRange: req.body.durationRange,
					requestorId: req.authUser.loginId,
					primaryOwnerId: assetObj.primaryOwner
				});
				newRequest.save(function(err) {
					if (err) 
						res.json(500,{ status: "failure", message: err });
					else	{
						console.log('Request saved successfully');
						res.json( 202, { status: "success", message: 'Request:'+ newRequest._id +' registered.' });
					}
				});
			}else	{
				res.json( 400, { status: "failure", message: 'Invalid duration range' });
			}
		}
	});
}


/**
The viewRequests method user user can view all the requests.
*/
assets.viewRequests = function (req, res, next) {
    
    if(req.authUser && req.authUser.role == "admin") {

        requests.find({ primaryOwnerId: req.authUser.loginId}, function(err, requestList) {
            if (err) 
				res.json(500,{ status: "failure", message: err });
            else if(requestList.length>0){
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
                req.requests ={};
                console.log("No requests assigned to user");
				req.requests ={};
				next();
            }
        });
    }else	{
		req.requests ={"message":"User not authorized."};
        console.log("User not authorized");
    }		
}

/**
The getAssetHistory method, primary owner can view the asset allocation history for an asset.
*/
assets.getAssetHistory = function (req, res, next) {
	var assetId = req.params.assetId;
	assetsCollection.findOne({ _id:assetId}, function(err, assetObj) {
		if (err) 
			return res.status(500).send({ 
						status: "failure", 
						message: err
				});
		else if(assetObj.primaryOwner == req.authUser.loginId)	{ //check logged user is the assetPrimaryOwner
			req.assets = assetObj.history;
			next();
		}
		else	{
			return res.status(401).send({ 
						status: "failure", 
						message: 'Logged in user: ' +  req.authUser.loginId + ' is not the asset primary owner.'
				});
		}
	});
}

/**
The getAssetbyId method to view the asset.
*/
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

/**
The rejectRequest method, the primary owner can reject the asset request.
*/
assets.rejectRequest = function (req, res, next) {    

    var requestId = req.param("requestId") ? req.param("requestId") : ""
    if(req.authUser && req.authUser.role == "admin") {
        
        requests.update({ _id: requestId , primaryOwnerId: req.authUser.loginId },{status:"Rejected"},{upsert:true},
			function(err, numAffected) {
			if(err) {
				res.json(500,{ status: "failure", message: err });
			}
			else { 
				next();
			}
		});
        
    }else{
        console.log("User not authorized");
		res.json(401,{ status: "failure", message: "User not authorized" });
    }	
}
