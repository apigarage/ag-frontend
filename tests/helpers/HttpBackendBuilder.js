angular.module('app')
.factory('HttpBackendBuilder', function(){
  var build = function($httpBackend, request, result){
    return $httpBackend.expect(
        request.method,
        request.url,
        request.data,
        request.headers)
      .response(
        result.status,
        result.data,
        result.headers,
        result.statusText
      );
  };

  return {
    build: build
  };
});
