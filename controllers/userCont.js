
var user = require('./../lib/middleware/user');
var utils = require('./../lib/middleware/utils');

/**
 * Find Json
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
var userCont = module.exports;

userCont.getUsers = [
    utils.tokenAuthentication,
    user.getUsers
];

