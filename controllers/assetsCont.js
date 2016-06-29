
var assets = require('./../lib/middleware/assets');

/**
 * Find Json
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
var AssetsCont = module.exports;

AssetsCont.getAssets = [
    assets.getAssets
];

