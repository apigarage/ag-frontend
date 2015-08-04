'use strict';

/* Services */

angular.module('app')
 /*
 * All the application Configs
 */
 .factory('Config', ['$http', '$window', function ($http, $window) {
   return $window.env;
 }]);
