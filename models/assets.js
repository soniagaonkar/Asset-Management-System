var mongoose = require('./../config/db');

var assetsSchema = new mongoose.Schema({
    name: { type: String },
    primaryOwner: { type: String },
    currentOwner: { type: String },
	isFree: { type: Boolean , default: true},
	isDeleted: { type: Boolean , default: false},
	category: { type: String },
	subCategory: { type: String },
	description: { type: String },
	remarks: { type: String },
    fromDate: { type: Date },
	toDate: { type: Date },
	recCreatedDate:{ type: Date, default: Date.now },
	recUpdatedDate:{ type: Date, default: Date.now },
	history:[{owner: { type: String, required: true }, 
			assignFromDate: { type: Date }, 
			assignToDate: { type: Date }, 
			recCreationDate:{ type: Date, default: Date.now }
			}]
});

var assets = mongoose.model('assets', assetsSchema);

module.exports = assets;


/*
  db.assets.insert( {   
   "name": "Keyboard",
    primaryOwner: "Rashmi",
    currentOwner: "Sonia",
	isFree: true,
	isDeleted: false,
	category: "Hardware",
	subCategory: "Desktop",
	description: "Desktop keyboard",
	remarks: "in good condition",
    fromDate: "",
	toDate: "",
	history:[{owner: "Raj",
			fromDate: "", 
			toDate: "" 
			}] 
  } )
*/