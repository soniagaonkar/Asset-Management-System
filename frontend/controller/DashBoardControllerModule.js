
var scm = angular.module('DashBoardControllerModule',['angularUtils.directives.dirPagination', 'ngCookies']);
scm.controller('DashBoardController', ['$scope', '$rootScope','DashBoardService','$stateParams', '$location', '$localStorage', '$modal', '$window', function($scope,$rootscope,DashBoardService,$stateParams,$location,$localStorage,$modal,$window) {
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
                    $localStorage.token = data.token;                               
                    $localStorage.role = data.role;                               
                    $rootscope.token = data.token;
                    $rootscope.role = data.role;
                        
                    //$location.path("/dashboard");             
                    $window.location.href = '#/dashboard';
                    $window.location.reload();

            }).error(function (data,status) {
                $scope.loginError = "Incorrect Username or Password!";
                console.log("Incorrect Username or Password!");
            });
        }
    }
    
    //load assets again
   loadAssets = function() {       
       
        DashBoardService.assets($localStorage, $stateParams.type).success(function (data) {

                $rootscope.loggedin = $localStorage.loggedin;
                $rootscope.username = $localStorage.username;
                $rootscope.role = $localStorage.role;
                var assetsData = data.assets; 
                assetsData = _.where(assetsData, {isDeleted: false});

                $scope.assetsData = assetsData;   
                $scope.assetsType = $stateParams.type;        

                if(assetsData.length==0) $scope.noAssetsFound = "No assets found";
                else delete $scope.noAssetsFound;        

                DashBoardService.getUsers($localStorage).success(function (data) {            

                    userData = _.where(data.users, {role: "admin"});            
                    $scope.users = userData;                                  
                }).error(function (data,status) {
                    console.log("error");
                });     


        }).error(function (data,status) {
            console.log("error");
        });
    }
   
    
    //load all assets
    loadAssets();
    
    //get assets function 
   /* DashBoardService.assets($localStorage, $stateParams.type).success(function (data) {

        $rootscope.loggedin = $localStorage.loggedin;
        $rootscope.username = $localStorage.username;
        $rootscope.role = $localStorage.role;
        var assetsData = data.assets; 
        assetsData = _.where(assetsData, {isDeleted: false});
        
        $scope.assetsData = assetsData;   
        $scope.assetsType = $stateParams.type;        

        if(assetsData.length==0) $scope.noAssetsFound = "No assets found";
        else delete $scope.noAssetsFound;        
        
        DashBoardService.getUsers($localStorage).success(function (data) {            

            userData = _.where(data.users, {role: "admin"});            
            $scope.users = userData;                                  
        }).error(function (data,status) {
            console.log("error");
        });     
        
        
    }).error(function (data,status) {
        console.log("error");
    });*/
    

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
    if($location.path().includes("editAsset") && $stateParams.editAssetId) {      
       
         DashBoardService.getAssetbyID($localStorage,$stateParams.editAssetId).success(function (data) {

            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;    
            $scope.name = data.assets[0].name;   
            $scope.description = data.assets[0].description;   
            $scope.category = data.assets[0].category;   
            $scope.subCategory = data.assets[0].subCategory;   
            $scope.remarks = data.assets[0].remarks; 

        }).error(function (data,status) {
            console.log("error");
        });    
    }
    
    
    

     $scope.searchAsset = function() { 
 
        var inputData = {
            primaryOwnerId: $scope.selOwnerName,
            token: $localStorage.token
        } 
        
        DashBoardService.searchAssets(inputData).success(function (data) {
        
            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;
            $rootscope.role = $localStorage.role;
            var assetsData = data.assets; 
            assetsData = _.where(assetsData, {isDeleted: false});

            $scope.assetsData = assetsData;   
            $scope.assetsType = $stateParams.type;        

            if(assetsData.length==0) $scope.noAssetsFound = "No assets found";
            else delete $scope.noAssetsFound;        

            DashBoardService.getUsers($localStorage).success(function (data) {            

                userData = _.where(data.users, {role: "admin"});            
                $scope.users = userData;                                  
            }).error(function (data,status) {
                console.log("error");
            }); 



        }).error(function (data,status) {
            console.log("error");
        });
    
        
    }
    
     //****************************
     
     
     
     
     
     
     
     
     
     
     
     
     
    
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

            $scope.status = data.status;
            $scope.ack = data.message; 

        }).error(function (data,status) {
            console.log("error");
        });
    }
    
    //delete asset function    
    $scope.deleteAsset = function(id) {
        DashBoardService.deleteAsset($localStorage, id).success(function (data) {
           loadAssets();
        }).error(function (data,status) {
            console.log("error");
        });        
    }
    
    //disable asset function    
    $scope.disableAsset = function(id) {
        $localStorage.disable = "yes"
                
        DashBoardService.disableAsset($localStorage, id).success(function (data) {
           loadAssets();
        }).error(function (data,status) {
            console.log("error");
        });        
    }
    

   
   
   //load Requests again
   loadRequests = function() {
       DashBoardService.getRequests($localStorage).success(function (data) {
           
          // $scope.requestData = data.requests;
           if( $localStorage.role=='admin'){
                var requests = _.filter(data.requests, function(reqs){ 
                    if(reqs.request.primaryOwnerId==$localStorage.username){
                      return true;
                    }            
                });
           }else{
               var requests = _.filter(data.requests, function(reqs){ 
                    if(reqs.request.requestorId==$localStorage.username){
                      return true;
                    }            
               });   
           }
           
           $scope.requestData = requests;
                      
           if(data.requests.length>0) {
                delete $scope.noRequestData
           }else {
                $scope.noRequestData = "No requests found!"
           }
        }).error(function (data,status) {
            console.log("error");
        });                 
   }
   
   
    //get requests function  
    if($location.path()=="/requests") {  
        loadRequests();
    }
       
    
     //add asset function
    $scope.requestAsset = function() { 
 
        var inputData = {
            message: $scope.message, 
            duration: $scope.duration,
            durationRange: $scope.durationRange,
            token: $rootscope.token
        } 
        
        var validDuration = "";
        if(inputData.duration) validDuration = /^\d+$/.test(inputData.duration);        
    
        if(inputData.duration && inputData.durationRange ){
            
            if(inputData.duration && inputData.durationRange ){  
                 
                DashBoardService.requestAsset(inputData, $stateParams.reqAssetId).success(function (data) {
                    delete formFieldsMissing;
                    $scope.status = data.status;
                    $scope.ack = data.message;
                }).error(function (data,status) {
                    console.log("error");
                });
                
            }  else{
                $scope.formFieldsMissing = "Duration must be a numeric value";
                console.log("Duration must be a numeric value");
            }
        }else{
             $scope.formFieldsMissing = "Form fields missing!";
             console.log("Form fields missing!");
        }
        
    }
    
    
    
    //reject asset function
    $scope.rejectRequest = function(id) { 

        DashBoardService.rejectRequest($localStorage, id).success(function (data) {
           loadRequests();
       
        }).error(function (data,status) {
            console.log("error");
        });
    }

    //Assig asset UI data
    if($location.path().includes("assignAsset") && $stateParams.assetId) {
        
        $scope.assignTo = $stateParams.assignTo ? $stateParams.assignTo : "";

        DashBoardService.getUsers($localStorage).success(function (data) {
            $scope.users = data.users;                                  
        }).error(function (data,status) {
            console.log("error");
        });         
    }
    
    
     //assign asset function
    $scope.assignAsset = function() { 
        
        $scope.dateIncorrect = "";
        
        if(isValidDate($scope.fromDate) && isValidDate($scope.toDate)){
            var inputData = {
                assignTo: $scope.assignTo, 
                fromDate: $scope.fromDate, 
                toDate: $scope.toDate, 
                remarks: $scope.remarks, 
                token: $rootscope.token
            } 

            if($scope.assignTo && $scope.fromDate && $scope.toDate && $scope.token){
                DashBoardService.assignAsset(inputData, $stateParams.assetId).success(function (data) {
                    $scope.status = data.status;
                    $scope.ack = data.message;

                }).error(function (data,status) {
                    console.log("error");
                });
            }else{
                $scope.dateIncorrect = "Form fields missing!";
                console.log("Form fields missing!");
            }
        }else{
            $scope.dateIncorrect = "Please check the dates entered!";
            console.log("Please check the dates entered!");
        }
        
    }
    
    //view Asset function
    if($location.path().includes("viewAsset") && $stateParams.assetId) {
     
        DashBoardService.viewAsset($localStorage, $stateParams.assetId).success(function (data) {
            $scope.asset = data.assets;
            $rootscope.username = $localStorage.username;   
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
            delete $localStorage;
            $location.path("/login"); //redirect to login page

        }).error(function (data,status) {
            console.log("error");
        });
    }
   
   // get counts for Dashboard
   if($location.path().includes("dashboard")) {    
       
        DashBoardService.assets($localStorage, $stateParams.type).success(function (data) {

            $rootscope.loggedin = $localStorage.loggedin;
            $rootscope.username = $localStorage.username;
            $rootscope.role = $localStorage.role;
            var assetsData = data.assets; 
           
            assetsData = _.where(assetsData, {isDeleted: false});
            $scope.totalAssets = assetsData.length ? assetsData.length : 0;
            
            assetsFree = _.where(assetsData, {isFree: true});            
            $scope.freeAssets = assetsFree.length ? assetsFree.length : 0;
            
            assetsOwned = _.where(assetsData, {primaryOwner: $localStorage.username});            
            $scope.ownedAssets = assetsOwned.length ? assetsOwned.length : 0;
            
            assetsAssignedToMe = _.where(assetsData, {currentOwner: $localStorage.username});            
            $scope.assignedToMeAssets = assetsAssignedToMe.length ? assetsAssignedToMe.length : 0;

        }).error(function (data,status) {
        console.log("error");
        });
       
   }
   
   
    
    //date validator function
    function isValidDate(date) {
        var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
        if (matches == null) return false;
        var d = matches[2];
        var m = matches[1] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
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
