
var assets = require('./../lib/middleware/assets');


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



