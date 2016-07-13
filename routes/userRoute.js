
var userCont = require('./../controllers/userCont');
var lib = require('./../lib/middleware/utils');

module.exports.set = function(appObj,configVars){
    var v1 = configVars.version.v1;

    appObj.get(v1 +'users', userCont.getUsers, lib.outputUsers);    

}

