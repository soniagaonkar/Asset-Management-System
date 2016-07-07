var assets = require('./../lib/middleware/assets');
var utils = require('./../lib/middleware/utils');


var AssetsCont = module.exports;

AssetsCont.getAssets = [
	utils.tokenAuthentication,
    assets.getAssets
];

AssetsCont.addAsset = [
	utils.tokenAuthentication,
    assets.addAsset
];

AssetsCont.addHistory = [
	utils.tokenAuthentication,
    assets.addHistory
];

AssetsCont.modifyAsset = [
	utils.tokenAuthentication,
    assets.modifyAsset
];

AssetsCont.deleteAsset = [
	utils.tokenAuthentication,
    assets.deleteAsset
];

AssetsCont.assignAsset = [
	utils.tokenAuthentication,
    assets.assignAsset
];

AssetsCont.requestAsset = [
	utils.tokenAuthentication,
    assets.requestAsset
];

AssetsCont.viewRequests = [
    utils.tokenAuthentication,
    assets.viewRequests
];

AssetsCont.getAssetbyId = [
	utils.tokenAuthentication,
    assets.getAssetbyId
];

