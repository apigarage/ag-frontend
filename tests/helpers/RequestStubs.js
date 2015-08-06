angular.module('app')
.factory('RequestStubs', ['HttpBackendBuilder', function($HttpBackendBuilder){
  var stubCommonGetRequest = function($httpBackend){
    var request = {
      method: 'GET',
      url : 'http://www.google.com'
    };

    var expectedResult = {
      status : 200,
      statusText : 'OK',
      data : 'The data is here.',
      headers : {'key1':'v1'}
    };

    return $HttpBackendBuilder.build($httpBackend, request, expectedResult);
  };

  return{
    stubCommonGetRequest:stubCommonGetRequest
  };
}]);
