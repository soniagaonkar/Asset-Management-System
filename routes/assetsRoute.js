
var assetsCont = require('./../controllers/assetsCont');
var lib = require('./../lib/middleware/utils');

module.exports.set = function(appObj,configVars){
    var v1 = configVars.version.v1;
    
    appObj.get(v1 +'assets', assetsCont.getAssets, lib.outputListAssets); 
	
	appObj.get(v1 +'assets/:assetId', assetsCont.getAssetbyId, lib.outputListAssets); 
	
	appObj.get(v1 +'assets/:assetId/history', assetsCont.getAssetHistory, lib.outputListAssetHistory); 
    
    appObj.get(v1 +'assets/type/:type', assetsCont.getAssets, lib.outputListAssets);   
	
	appObj.get(v1 +'assignedAssets/', assetsCont.getAssignedAssets, lib.outputListAssets);   
	
	appObj.put(v1 +'assets/:assetId', assetsCont.modifyAsset, lib.outputAssets);   
	
	appObj.post(v1 +'assets', assetsCont.addAsset, lib.outputAssets);
  	
	appObj.delete(v1 +'assets/:assetId', assetsCont.deleteAsset, lib.outputAssets);
	
    
    appObj.put(v1 +'assets/:assetId/disable', assetsCont.deleteAsset, lib.outputAssets);
    
	
    appObj.post(v1 +'assets/:assetId/request', assetsCont.requestAsset, lib.outputAssets);
	
	appObj.get(v1 +'requests', assetsCont.viewRequests, lib.outputListRequests);
	
	appObj.post(v1 +'assets/:assetId/assign', assetsCont.assignAsset, lib.outputAssets);
	
	appObj.put(v1 +'assets/:assetId/assign', assetsCont.assignAsset, lib.outputAssets);
    
    appObj.put(v1 +'requests/:requestId/reject', assetsCont.rejectRequest, lib.outputOK);

}

