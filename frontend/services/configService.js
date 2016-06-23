/*
'use strict';

angular.module('dashboardApp').factory('config', function Config() {
	var env = (function () {
		var url = window.document.URL;

		if (url.indexOf('http://127.0.0.1') === 0 || url.indexOf('http://localhost') === 0 || url.indexOf('http://dev') === 0) {
			return 'local';
		}

        if (url.indexOf('http://is-dashboard-dev.stage1.mybluemix.net') === 0) {
            return 'development';
        }

		if (url.indexOf('http://is-dashboard.stage1.mybluemix.net') === 0) {
			return 'staging';
		}

		if (url.indexOf('https://prod') === 0 || url.indexOf('https://prod') === 0) {
			return 'production';
		}
	})();

	if (!env) {
		throw new Error('failed to detect application env');
	}

	return window.config[env];
});

*/
