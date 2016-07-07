var app = angular.module('dashboardApp', ['ui.router','DashBoardControllerModule','DashBoardServiceModule','showDetailControllerModule', 'ngStorage', 'ui.bootstrap', 'ui.bootstrap.modal']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
 
    $stateProvider
        .state('login', {
            url:'/login',
            templateUrl: 'templates/login.html',
            controller: 'DashBoardController'
        })
    
        .state('dashboard', {
            url:'/dashboard',
            templateUrl: 'templates/dashboard.html',
            controller: 'DashBoardController'
        })
    
        .state('assets', {
            url:'/assets',
            templateUrl: 'templates/assets.html',
            controller: 'DashBoardController'
        })
    
        .state('assets/:type', {
            url:'/assets/:type',
            templateUrl: 'templates/assets.html',
            controller: 'DashBoardController'
        })
    
        .state('addAsset', {
            url:'/addAsset',
            templateUrl: 'templates/addAsset.html',
            controller: 'DashBoardController'
        })
    
       .state('editAsset', {
            url:'/editAsset/:editAssetId',
            templateUrl: 'templates/editAsset.html',
            controller: 'DashBoardController'
        })
        
        .state('requests', {
            url:'/requests',
            templateUrl: 'templates/requests.html',
            controller: 'DashBoardController'
        }) 

    
        .state('requestAsset', {
            url:'/requestAsset/:reqAssetId',
            templateUrl: 'templates/requestAsset.html',
            controller: 'DashBoardController'
        })
        
       
}]);
