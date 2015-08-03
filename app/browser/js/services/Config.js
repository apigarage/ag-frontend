'use strict';

/* Services */

angular.module('app')
 /*
 * All the application Configs
 */
.factory('Config', ['$http', function ($http) {
  return {
    env: "chrome",
    url: "http://dev.chinman.backend.com/",
    // url: "http://api.apigarage.com/",
    api: "api/",
    client_id: "id_z7y3e0902uNtMxO07Z6q",
    client_secret: "secret_44207Z6q1Lq5e6me0902"
  };
}]);