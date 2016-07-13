
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
                    $localStorage.token = data.token;                               
                    $localStorage.role = data.role;                               
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
        $rootscope.token = data.token;
        $rootscope.role = data.role;
    
       
    }).error(function (data,status) {
            console.log("error");
    });       

    
    //get assets function 
    DashBoardService.assets($localStorage, $stateParams.type).success(function (data) {

        $rootscope.loggedin = $localStorage.loggedin;
        $rootscope.username = $localStorage.username;
        $rootscope.role = $localStorage.role;
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
   
   
   //load Requests again
   loadRequests = function() {
       DashBoardService.getRequests($localStorage).success(function (data) {
            $scope.requestData = data.requests;          
        }).error(function (data,status) {
            console.log("error");
        });                 
   }
   
   
    //get requests function  
    if($location.path()=="/requests") {  
        DashBoardService.getRequests($localStorage).success(function (data) {
            $scope.requestData = data.requests;          
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
            console.log("Form fields missing!");
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
       console.log("Svvvvvvvvvvvvvvvvvvvvvvv");
       
   }
   
   
    
    
   
   /*
   
   
   
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }*/
   
   
   
   
   
   
   
   
   
   
   

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

