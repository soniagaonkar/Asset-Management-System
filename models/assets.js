var mongoose = require('./../config/db');

var assetsSchema = new mongoose.Schema({
    name: { type: String },
    primaryOwner: { type: String },
    lastUpdated: { type: Date, default: Date.now },
});

var assets = mongoose.model('assets', assetsSchema);

module.exports = assets;
