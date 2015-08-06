angular.module('app')
.factory('HttpBackendBuilder', ['$httpBackend', function($httpBackend){
  var build = function(request, result){
    return $httpBackend.expect(
        request.method,
        request.url,
        request.data,
        request.headers)
      .respond(
        result.status,
        result.data,
        result.headers,
        result.statusText
      );
  };

  return {
    build : build
  };
}]);
