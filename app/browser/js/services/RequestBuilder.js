angular.module('app')
 /*
 * All the application Configs
 */
 .factory('RequestBuilder', ['$window', function ($window) {
   return $window.requestBuilder;
 }]);
