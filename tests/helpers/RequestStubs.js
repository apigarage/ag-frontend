angular.module('app')
.factory('RequestStubs', ['HttpBackendBuilder', function($HttpBackendBuilder){
  var stubCommonGetRequest = function($httpBackend){
    var request = {
      url : 'http://www.google.com',
      data : {
        "name":"test",
        "email":"test@test.ca",
        "id":18
      },
    };

    var expectedResult = {
      status : 200,
      statusText : 'OK',
      data : 'The data is here.',
      headers : {}
    };

    return $HttpBackendBuilder.build($httpBackend, request, expectedResult);
  };

  return{
    stubCommonGetRequest:stubCommonGetRequest
  };
}]);
