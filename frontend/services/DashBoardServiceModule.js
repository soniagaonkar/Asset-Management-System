var ssm=angular.module('DashBoardServiceModule',[]);

//ssm.factory('DashBoardService',function($http,config){
ssm.factory('DashBoardService',function($http){
  //  var base_url = config.dashboard.url + config.dashboard.version;
    
   // console.log(base_url);
    //console.log("base urllllllllllll");
  var  base_url = "http://localhost:8080/api/v1";
    
	return {
        login:function(inputData) {
            
            console.log("kkkkkkkkkkkkkkkk");
            
            return $http.post(base_url + '/login', inputData);
        },
        
        
        test:function(inputData) {
             return $http.post(base_url + '/login', inputData);
        },

        logout:function(inputData) {
        
            return $http.get(base_url + '/logout', inputData);
        },
        
        assets:function(inputData) {
        
            return $http.get(base_url + '/assets', inputData);
        }

	}
})