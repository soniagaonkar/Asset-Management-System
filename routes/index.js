/**
 * This is the main file to be used for routing
 */
configVars = require('./../config/vars')
/**
 * Sets the routers for all calls
 * @param app Application object
 * @param fs file system object
 */
  module.exports.set = function(app, fs) {
    var appObj = app;
	fs.readdirSync(__dirname).forEach(function (file,indexer) {
	  if(file == 'index.js' || file.indexOf('.js') < 0 ){
        return true;
	  }
        require('./'+file).set(appObj,configVars);
	})
      appObj.get('*', function(req, res) {
          res.sendfile('./index.html'); // load our frontend/index.html file
    });
  }