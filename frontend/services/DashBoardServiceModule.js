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
        }

       

	}
})