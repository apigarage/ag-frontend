angular.module('app').
directive("mockingServerSettingsDrtv", function() {
  return {
    restrict: 'E',
    templateUrl: 'html/mocking-settings.html',
    controller: 'MockingSettingsCtrl',
    controllerAs: 'MockingSettingsCtrl'
  };
});
