var mongoose = require('./../config/db');

var requestSchema = new mongoose.Schema({
    assetId: { type: String },
	message: { type: String },
	duration: { type: Number },
	status: { type: String },
	requestorId: { type: String },
	primaryOwnerId: { type: String },
    createdDate: { type: Date, default: Date.now },
	updatedDate: { type: Date, default: Date.now },
});

var requests = mongoose.model('requests', requestSchema);

module.exports = requests;
