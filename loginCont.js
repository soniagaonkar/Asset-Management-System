
var login = require('./../lib/middleware/login');

/**
 * Find Json
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
var loginCont = module.exports;

loginCont.login = [
    login.login
];

loginCont.logout = [
    login.allowCrossDomain,
    login.logout
];


