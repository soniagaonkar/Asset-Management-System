var ssm=angular.module('DashBoardServiceModule',[]);

ssm.factory('DashBoardService',function($http, $location){
    
    var base_url = $location.protocol() + '://'+ $location.host()+':'+  $location.port()+'/api/v1'    
    base_url = base_url ? base_url : "http://localhost:8080/api/v1";    
    
	return {
        login:function(inputData) {
            return $http.post(base_url + '/login', inputData);
        },        
        
     /*   test:function(inputData) {
            return $http.post(base_url + '/login', inputData);
        },*/
        
        register:function(inputData) {
            return $http.post(base_url + '/register', inputData);
        }, 

        logout:function(inputData) {        
            return $http.get(base_url + '/logout', inputData);
        },
        
        assets:function(inputData,type) {
        
            if(type){
                return $http.get(base_url + '/assets/type/'+type, { headers: {'x-access-token': inputData.token }});                
            }else {
                return $http.get(base_url + '/assets', { headers: {'x-access-token': inputData.token }});
            }
        },
        
        searchAssets:function(inputData) {       
                return $http.get(base_url + '/assets?primaryOwnerId='+inputData.primaryOwnerId, { headers: {'x-access-token': inputData.token }});
        },
        
        addAsset:function(inputData) {
            return $http.post(base_url + '/assets', inputData);
        },      

        getAssetbyID:function(inputData, assetID) {
            return $http.get(base_url + '/assets/'+assetID, { headers: {'x-access-token': inputData.token }});
        },
        
        editAsset:function(inputData, assetID) {
            return $http.put(base_url + '/assets/'+assetID, inputData);
        },
        
        deleteAsset:function(inputData, assetID) {
            return $http.delete(base_url + '/assets/'+assetID, { headers: {'x-access-token': inputData.token }});
        },
        
        disableAsset:function(inputData, assetID) {
            return $http.put(base_url + '/assets/'+assetID+'/disable', inputData);
        },
        
        getRequests:function(inputData) { 
            return $http.get(base_url + '/requests/', { headers: {'x-access-token': inputData.token }});
        },
        
        requestAsset:function(inputData, id) {
            return $http.post(base_url + '/assets/'+id+'/request', inputData);
        }, 
        
        rejectRequest:function(inputData, requestId) {
            return $http.put(base_url + '/requests/'+requestId+'/reject', inputData);
        },
        
        assignAsset:function(inputData, id) {
            return $http.post(base_url + '/assets/'+id+'/assign', inputData);
        },
        
        getUsers:function(inputData) { 
            return $http.get(base_url + '/users/', { headers: {'x-access-token': inputData.token }});
        },
        
        viewAsset:function(inputData, id) { 
            return $http.get(base_url + '/assets/' + id, { headers: {'x-access-token': inputData.token }});
        }
        
	}
})