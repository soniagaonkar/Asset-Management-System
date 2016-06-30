
var assetsCont = require('./../controllers/assetsCont');
var lib = require('./../lib/middleware/utils');

module.exports.set = function(appObj,configVars){
    var v1 = configVars.version.v1;
    
    appObj.get(v1 +'assets', assetsCont.getAssets, lib.outputListAssets);    
	
	appObj.put(v1 +'assets', assetsCont.addHistory, lib.outputAssets);   
	
	appObj.post(v1 +'assets', assetsCont.addAsset, lib.outputAssets);  	
    
}

