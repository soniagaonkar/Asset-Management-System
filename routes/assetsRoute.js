
var assetsCont = require('./../controllers/assetsCont');
var lib = require('./../lib/middleware/utils');

module.exports.set = function(appObj,configVars){
    var v1 = configVars.version.v1;
    
    appObj.get(v1 +'assets', assetsCont.getAssets, lib.outputAssets);    
    
}

