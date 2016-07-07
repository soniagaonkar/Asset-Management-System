
var scm = angular.module('DashBoardControllerModule',['angularUtils.directives.dirPagination', 'ngCookies']);
scm.controller('DashBoardController', ['$scope', '$rootScope','DashBoardService','$stateParams', '$location', '$localStorage', '$modal', function($scope,$rootscope,DashBoardService,$stateParams,$location,$localStorage, $modal) {
   // $rootscope.host = config.dashboard.host;
    
    $scope.login = function() {

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
                        username: data.loginId,
                        token: data.token
                    });

                    $scope.$storage = $localStorage;
                    $localStorage.loggedin = true;
                    $localStorage.username = data.loginId;                               
                    $rootscope.token = data.token;
                    $rootscope.role = data.role;
                        
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

    
    //get assets function 
    DashBoardService.assets($localStorage, $stateParams.type).success(function (data) {

        $rootscope.loggedin = $localStorage.loggedin;
        $rootscope.username = $localStorage.username;
        $scope.assetsData = data.assets;   
        $scope.assetsType = $stateParams.type;   
        
    }).error(function (data,status) {
        console.log("error");
    });
    

    //add asset function
    $scope.addAsset = function() { 
 
        var inputData = {
            name: $scope.name, 
            description: $scope.description,
            category: $scope.category,
            subCategory: $scope.subCategory,
            remarks: $scope.remarks,
            primaryOwner: $rootscope.username,
            token: $rootscope.token
        }        
        
        DashBoardService.addAsset(inputData).success(function (data) {
            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;
            $scope.status = data.status;
            $scope.ack = data.message;
       
        }).error(function (data,status) {
            console.log("error");
        });
    }
    
    //edit asset page load function
    if($stateParams.editAssetId) { 
         DashBoardService.getAssetbyID($localStorage,$stateParams.editAssetId).success(function (data) {

            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;
            $scope.assetsData = data.assets;   
            
            $scope.name = data.assets[0].name;   
            $scope.description = data.assets[0].description;   
            $scope.category = data.assets[0].category;   
            $scope.subCategory = data.assets[0].subCategory;   
            $scope.remarks = data.assets[0].remarks;   
 

        }).error(function (data,status) {
            console.log("error");
        });    
    }
    
    
    $scope.editAsset = function() {
        
           var inputData = {
            name: $scope.name, 
            description: $scope.description,
            category: $scope.category,
            subCategory: $scope.subCategory,
            remarks: $scope.remarks,
            primaryOwner: $rootscope.username,
            token: $rootscope.token
        }        
        
        DashBoardService.editAsset(inputData,$stateParams.editAssetId).success(function (data) {

            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;
            $scope.status = data.status;
            $scope.ack = data.message; 

        }).error(function (data,status) {
            console.log("error");
        });
    }
    
    //delete asset function    
    $scope.deleteAsset = function(id) {
        DashBoardService.deleteAsset(id).success(function (data) {
           loadAssets();
        }).error(function (data,status) {
            console.log("error");
        });        
    }
    

   //load assets again
   loadAssets = function() {
       
       DashBoardService.assets($localStorage, $stateParams.type).success(function (data) {

            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;
            $scope.assetsData = data.assets;   
            $scope.assetsType = $stateParams.type;   

        }).error(function (data,status) {
            console.log("error");
        });            
    }
   
   
   
   //get requests function  
   if($location.path()=="/requests") {  console.log("AAAAAAAAAAAAAAAAAAA");
        DashBoardService.getRequests($localStorage).success(function (data) {

            //$rootscope.loggedin = $localStorage.loggedin;
            //$rootscope.username = $localStorage.username;
            $scope.requestData = data.requests;   
            //$scope.assetsType = $stateParams.type;   
       
            console.log(data);
            console.log("qqqqqqqqqqqqqqqqqqqq");
        
        }).error(function (data,status) {
            console.log("error");
        });         
   }
   
    
    
     //add asset function
    $scope.requestAsset = function() { 
 
        var inputData = {
            message: $scope.message, 
            duration: $scope.duration,
            durationRange: $scope.durationRange,
            token: $rootscope.token
        }        
        
        DashBoardService.requestAsset(inputData, $stateParams.reqAssetId).success(function (data) {
            $scope.status = data.status;
            $scope.ack = data.message;
       
        }).error(function (data,status) {
            console.log("error");
        });
    }
    
    
    
   
   //logout function
   $rootscope.logout = function(){
       
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


app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])

