
var login = require('./../lib/middleware/login');

/**
 * Find Json
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
var LoginCont = module.exports;

LoginCont.login = [
    login.login
];

LoginCont.logout = [
    login.logout
];

LoginCont.apiUrl = [
    login.apiUrl
];

