angular.module('app').
directive("projectShareDrtv", function() {
  return {
    restrict: 'E',
    templateUrl: 'html/project-share.html',
    controller: 'ProjectShareCtrl',
    controllerAs: 'ProjectShareCtrl'
  };
});
