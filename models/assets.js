var mongoose = require('./../config/db');

var assetsSchema = new mongoose.Schema({
    name: { type: String },
    primaryOwner: { type: String },
    currentOwner: { type: String },
	isFree: { type: Boolean , default: true},
	isDeleted: { type: Boolean , default: false}
	category: { type: String },
	subCategory: { type: String },
	description: { type: String },
	remarks: { type: String },
    fromDate: { type: Date, default: Date.now },
	toDate: { type: Date, default: Date.now },
	recCreatedDate:{ type: Date, default: Date.now },
	recUpdatedDate:{ type: Date, default: Date.now }
	history:[{owner: { type: String, required: true }, 
			fromDate: { type: Date, required: true }, 
			toDate: { type: Date, required: true }, 
			recCreationDate:{ type: Date, default: Date.now }
			}]
},{collection: "history"});

var assets = mongoose.model('assets', assetsSchema);

module.exports = assets;
