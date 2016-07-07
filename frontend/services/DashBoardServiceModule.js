var ssm=angular.module('DashBoardServiceModule',[]);

//ssm.factory('DashBoardService',function($http,config){
ssm.factory('DashBoardService',function($http){
    //  var base_url = config.dashboard.url + config.dashboard.version;
    
    // console.log(base_url);
    var  base_url = "http://localhost:8080/api/v1";
    
	return {
        login:function(inputData) {
            return $http.post(base_url + '/login', inputData);
        },        
        
        test:function(inputData) {
             return $http.post(base_url + '/login', inputData);
        },

        logout:function(inputData) {        
            return $http.get(base_url + '/logout', inputData);
        },
        
        assets:function(inputData,type) {
            if(type)
                return $http.get(base_url + '/assets/'+type, inputData);                
            else 
                return $http.get(base_url + '/assets', inputData);
        },
        
        addAsset:function(inputData) {
             return $http.post(base_url + '/assets', inputData);
        },      

        getAssetbyID:function(inputData, assetID) {
             return $http.get(base_url + '/assets/getAssetbyId/'+assetID, inputData);
        },
        
        editAsset:function(inputData, assetID) {
             return $http.put(base_url + '/assets/'+assetID, inputData);
        },
        
        deleteAsset:function(assetID) {
             return $http.delete(base_url + '/assets/'+assetID);
        },
        
        getRequests:function(inputData) {  console.log("CCCCCCCCCCCCCCCC");      
             return $http.get(base_url + '/requests/', { headers: {'x-access-token': inputData.token }});
        },
        
        //'assets/:assetId/request
        requestAsset:function(inputData, id) {
             return $http.post(base_url + '/assets/'+id+'/request', inputData);
        }, 
	}
})