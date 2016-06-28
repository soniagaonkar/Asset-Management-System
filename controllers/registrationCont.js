
var register = require('./../lib/middleware/register');

/**
 * Find Json
 * @param req Object Request parameter
 * @param res Object Response
 * @param next Error object
 */
var registrationCont = module.exports;

registrationCont.register = [
    register.addUser
];


