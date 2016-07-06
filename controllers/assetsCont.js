var assets = require('./../lib/middleware/assets');
var utils = require('./../lib/middleware/utils');


var AssetsCont = module.exports;

AssetsCont.getAssets = [
    assets.getAssets
];

AssetsCont.addAsset = [
    assets.addAsset
];

AssetsCont.addHistory = [
    assets.addHistory
];

AssetsCont.modifyAsset = [
    assets.modifyAsset
];

AssetsCont.deleteAsset = [
    assets.deleteAsset
];

AssetsCont.assignAsset = [
    assets.assignAsset
];

AssetsCont.requestAsset = [
    assets.requestAsset
];

AssetsCont.viewRequests = [
    utils.tokenAuthentication,
    assets.viewRequests
];

AssetsCont.getAssetbyId = [
    assets.getAssetbyId
];

