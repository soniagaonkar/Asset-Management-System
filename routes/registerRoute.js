
var registrationCont = require('./../controllers/registrationCont');
var lib = require('./../lib/middleware/utils');

module.exports.set = function(appObj,configVars){
    var v1 = configVars.version.v1;

    appObj.post(v1 +'register', registrationCont.register, lib.outputRegistration);    

}

