"use strict";

var _ = require('underscore'),
    async = require("async");

var lib = module.exports;

lib.tokenAuthentication = function (req, res, next) {
    //fetch the token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		var decoded = jwt.decode(token, config.SECRET);
		console.log(decoded.iss);
		User.findOne({
			_id: decoded.iss
			}, function(err, user) {
			if(user) {
				var loggedInUser = new User({ 
				loginId: user.loginId, 
				role: user.role
				});
                //token valid...user authenticated
                req.authUser = loggedInUser;
                next();
                
			}else {
				return res.status(401).send({ 
				success: false, 
				message: 'Invalid auth token.' 
				});
			}
		});
		
		
	} else {
		return console.error('Oh no! No token found')
	}
};


lib.outputlogin = function (req, res, next) {
    res.header("content-type", "application/json");
    //res.send(200, { "loginData" : req.loginData});

};

lib.outputAssets = function (req, res, next) {
    res.header("content-type", "application/json");
    //res.send(200, { "assets" : req.assets});
};

lib.outputListAssets = function (req, res, next) {
    res.header("content-type", "application/json");
    res.send(200, { "assets" : req.assets});
};

lib.outputListRequests = function (req, res, next) {
    res.header("content-type", "application/json");
    res.send(200, { "requests" : req.requests});
};

// Respond with a 200
lib.outputOK = function (req, res) {
    res.json(200, {});
};

lib.outputRegistration = function (req, res, next) {
    res.header("content-type", "application/json");
};


lib.parseFields = function (req, res, next) {
    req.fields = fieldFilter.parse(req.param("fields"));
    if (next) return next();
};


lib.getType = function (p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
}


//function for paginating results
lib.getPaginatedItems = function(items, page, limit) {
    var page = page || 1,
        per_page = limit || 3,
        offset = (page - 1) * per_page,
        paginatedItems = _.rest(items, offset).slice(0, per_page);
    return {
        page: page,
        per_page: per_page,
        total: items.length,
        total_pages: Math.ceil(items.length / per_page),
        data: paginatedItems
    };
}
