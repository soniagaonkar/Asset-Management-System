var sdc=angular.module('showDetailControllerModule',[]);

sdc.controller('ShowsDetailController',['$scope','$stateParams','ShowsService',function($scope,$stateParams,ShowsService){

    $scope.selectedShow=ShowsService.find(1);

}])