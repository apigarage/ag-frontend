angular.module('app')
 /*
 * All the application Configs
 */
 .factory('RequestUtility', ['$window', function ($window) {
   return $window.requestUtility;
 }]);
