"use strict";

var _ = require('underscore'),
    async = require("async");

var lib = module.exports;


lib.outputlogin = function (req, res, next) {
    res.header("content-type", "application/json");
};

lib.outputRegistration = function (req, res, next) {
    res.header("content-type", "application/json");
    res.send(200, { "message" : req.registrationData});

};

// Respond with a 200
lib.outputOK = function (req, res) {
    res.json(200, {});
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