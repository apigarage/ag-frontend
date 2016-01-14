angular.module('app').
directive("mockingServerLogsDrtv", function() {
  return {
    restrict: 'E',
    templateUrl: 'html/bottombar-mocking.html',
    controller: 'MockingCtrl',
    controllerAs: 'MockingCtrl',
    scope: {
      'agLayoutMocking' : "=",
      'agLayoutHistory' : "=",
      'agBottomBarMaximized' : "="
    }
  };
});
