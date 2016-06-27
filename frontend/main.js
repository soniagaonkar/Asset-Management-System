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
       
}]);
