
var scm = angular.module('DashBoardControllerModule',['angularUtils.directives.dirPagination', 'ngCookies']);
scm.controller('DashBoardController', ['$scope', '$rootScope','DashBoardService','config', '$stateParams', '$location', '$localStorage', '$modal', function($scope,$rootscope,DashBoardService,config,$stateParams,$location,$localStorage, $modal,$cookies,$cookieStore) {
    $rootscope.host = config.dashboard.host;
    
    $scope.login = function(){


        var inputData = {
            username : $scope.username,
            softLayerID : $scope.softLayerID,
            softLayerKey : $scope.softLayerKey
        }

        if(inputData.username && inputData.softLayerID && inputData.softLayerKey) {

            DashBoardService.login(inputData).success(function (data) {

                if (data.loginData.loginSuccess == true){

                    $rootscope.username = $scope.username
                    $rootscope.softLayerID = $scope.softLayerID
                    $rootscope.softLayerKey = $scope.softLayerKey

                    //set cookie  & redirect
                    $scope.loginSuccess = data.loginData.loginSuccess;

                    $scope.$storage = $localStorage.$default({
                        loggedin: true,
                        username: $scope.username
                    });

                    $scope.$storage = $localStorage;
                    $localStorage.loggedin = true;
                    $localStorage.username = $scope.username;
                    $localStorage.softLayerID = $scope.softLayerID;
                   
                    //$location.path("/inventory");
                    
                    DashBoardService.saveLogin(inputData).success(function (data) {
                        
                        //$rootscope.inventories = data.dataInventories.inventories
                        //$rootscope.VMInventories = data.dataInventories.VMInventories
                        $rootscope.loggedin = $localStorage.loggedin;
                        $rootscope.username = $localStorage.username;
                        $rootscope.softLayerID = $localStorage.softLayerID;
                        
                        $location.path("/inventory");

                   }).error(function (data,status) {
                        console.log("error");
                   });

                } else {
                    //show error
                    $scope.loginSuccess = data.loginData.loginSuccess;
                }
            }).error(function (data,status) {
                console.log("error");
            });
        }
    }

    
    
   DashBoardService.getInventories($localStorage).success(function (data) {

        $scope.showSpin = false;
        $rootscope.inventories = data.dataInventories.inventories
        $rootscope.VMInventories = data.dataInventories.VMInventories
        $rootscope.loggedin = $localStorage.loggedin;
        $rootscope.username = $localStorage.username;
        $rootscope.softLayerID = $localStorage.softLayerID;
     
        $scope.sort = function(keyname){
		      $scope.sortKey = keyname; //set the sortKey to the param passed
		      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
	    }
       
   }).error(function (data,status) {
            console.log("error");
   });
    
   
   //logout function
   $rootscope.logout = function(){
       
        DashBoardService.logout($localStorage).success(function (data) {
            $scope.$storage = $localStorage.$default({
                loggedin: false
            });

            $localStorage.$reset();
            $location.path("/dashboard"); //redirect to login page

        }).error(function (data,status) {
            console.log("error");
        });
    } 

}]);


scm.controller('ProductController', ['$scope', '$rootScope','DashBoardService','config', '$stateParams', '$location', '$localStorage', '$modal', 'analysisRes', function($scope,$rootscope,DashBoardService,config,$stateParams,$location,$localStorage, $modal, analysisRes) {
    $scope.analysisRes = analysisRes;
}]);


