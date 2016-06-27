
var scm = angular.module('DashBoardControllerModule',['angularUtils.directives.dirPagination', 'ngCookies']);
scm.controller('DashBoardController', ['$scope', '$rootScope','DashBoardService','$stateParams', '$location', '$localStorage', '$modal', function($scope,$rootscope,DashBoardService,config,$stateParams,$location,$localStorage, $modal,$cookies,$cookieStore) {
   // $rootscope.host = config.dashboard.host;
    
    $scope.login = function(){


        var inputData = {
            username : $scope.username,
            password : $scope.password,
        }
        
        console.log("ppppppppppppppppppp");
        console.log(inputData);
        console.log("ppppppppppppppppppp");

        if(inputData.username && inputData.password) {
            
            console.log("22222222222222");

            DashBoardService.login(inputData).success(function (data) {
                
                       console.log(data);
                       console.log("33333333333333");

                if (data.loginData.loginSuccess == true){
                    
                           console.log("4444444444444444");

                    $rootscope.username = $scope.username

                    //set cookie  & redirect
                    $scope.loginSuccess = data.loginData.loginSuccess;
                    $scope.$storage = $localStorage.$default({
                        loggedin: true,
                        username: $scope.username
                    });

                    $scope.$storage = $localStorage;
                    $localStorage.loggedin = true;
                    $localStorage.username = $scope.username;                               
                        
                    $location.path("/dashboard");             

                } else {
                    //show error
                    $scope.loginSuccess = data.loginData.loginSuccess;
                }
            }).error(function (data,status) {
                console.log("error");
            });
        }
    }
    
   
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


