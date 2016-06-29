
var scm = angular.module('DashBoardControllerModule',['angularUtils.directives.dirPagination', 'ngCookies']);
scm.controller('DashBoardController', ['$scope', '$rootScope','DashBoardService','$stateParams', '$location', '$localStorage', '$modal', function($scope,$rootscope,DashBoardService,$stateParams,$location,$localStorage, $modal) {
   // $rootscope.host = config.dashboard.host;
    
    $scope.login = function(){


        var inputData = {
            username : $scope.username,
            password : $scope.password,
        }       

        if(inputData.username && inputData.password) {

            DashBoardService.login(inputData).success(function (data) {             

                    $rootscope.username = $scope.username
                    $rootscope.loggedin = true;

                    //set cookie  & redirect
                    $scope.$storage = $localStorage.$default({
                        loggedin: true,
                        username: $scope.username
                    });

                    $scope.$storage = $localStorage;
                    $localStorage.loggedin = true;
                    $localStorage.username = $scope.username;                               
                        
                    $location.path("/dashboard");             

            }).error(function (data,status) {
                console.log("Incorrect Username/Password");
            });
        }
    }
    
    
    DashBoardService.test($localStorage).success(function (data) {

        $rootscope.loggedin = $localStorage.loggedin;
        $rootscope.username = $localStorage.username;
      
       
   }).error(function (data,status) {
            console.log("error");
   });
    
    
   DashBoardService.assets($localStorage).success(function (data) {

        $rootscope.loggedin = $localStorage.loggedin;
        $rootscope.username = $localStorage.username;
        $rootscope.assetsData = data.assets;
       
       console.log(data);
       console.log("pppppppppppp");
      
       
   }).error(function (data,status) {
            console.log("error");
   });
    
   
   //logout function
   $rootscope.logout = function(){ console.log("AAAAAAAAAAAAAAAAAAAA");
       
        DashBoardService.logout($localStorage).success(function (data) {
            $scope.$storage = $localStorage.$default({
                loggedin: false
            });
            delete $rootscope.username;
            delete $rootscope.loggedin;

            $localStorage.$reset();
            $location.path("/login"); //redirect to login page

        }).error(function (data,status) {
            console.log("error");
        });
    } 

}]);


scm.controller('ProductController', ['$scope', '$rootScope','DashBoardService','config', '$stateParams', '$location', '$localStorage', '$modal', 'analysisRes', function($scope,$rootscope,DashBoardService,config,$stateParams,$location,$localStorage, $modal, analysisRes) {
    $scope.analysisRes = analysisRes;
}]);


