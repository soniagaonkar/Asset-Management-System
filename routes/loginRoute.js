
var loginCont = require('./../controllers/loginCont');
var lib = require('./../lib/middleware/utils');

module.exports.set = function(appObj,configVars){
    var v1 = configVars.version.v1;

    appObj.post(v1 +'login', loginCont.login, lib.outputlogin);
    
    appObj.get(v1 +'logout', loginCont.logout, lib.outputOK);
    
    appObj.get(v1 +'apiUrl', loginCont.apiUrl, lib.outputapiUrl);

}

