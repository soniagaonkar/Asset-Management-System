var ssm=angular.module('DashBoardServiceModule',[]);

ssm.factory('DashBoardService',function($http,config){
    var base_url = config.dashboard.url + config.dashboard.version;
	return {
        login:function(inputData) {
            return $http.post(base_url + '/login', inputData);
        },

        getInventories:function(inputData) {
            return $http.get(base_url + '/inventory/sl_ID/'+inputData.softLayerID, inputData);
        },
        
        addSpinDelay:function(inputData) {
            return $http.post(base_url + '/logout', inputData);
        },

        saveLogin:function(inputData) {
            return $http.post(base_url + '/saveLogin', inputData);
        },
        
        logout:function(inputData) {           
            return $http.post(base_url + '/logout', inputData);
        }
    

        /*analyzeCode:function(inputData) {
            return $http.post(base_url + '/apps/'+inputData.appData.id+'/analysis', inputData);
        },

        logout:function(inputData) {
            return $http.post(base_url + '/logout', inputData);
        },

        updateAppById:function(inputData) {
            return $http.put(base_url + '/apps/'+inputData.appData.id, inputData);
        },

        getAnalysisData:function(inputData) {

            return $http.get(base_url + '/apps/'+inputData.appData.id+'/analysis/'+inputData.appData.analysis_details.id, inputData);
        },

       
      
        generateIPAddr:function(inputData) {
            return $http.post(base_url + '/genIPAddress', inputData);
        },

        searchMatchingIP:function(inputData) {
            return $http.post(base_url + '/searchIP', inputData);
        }*/
	}
})