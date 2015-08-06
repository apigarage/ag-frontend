angular.module('app')
// User Defined Client Calls

.factory('RequestStubs', ['HttpBackendBuilder', function($HttpBackendBuilder){
  var requestStubs = {
    // return a JSON Object
    simpleGetStub : {
      request : {
        method : 'GET',
        url : 'www.google.com',
        // expected google get header
        headers : {
          "0":{"key":"Content-Type",
          "value":"application/json"},
          "1":{"key":"language",
            "value":"EN"},
            "Accept":"application/json, text/plain, */*"
          }
      },
      response : {
        status : 200,
        data : "Test Data GET",
        statusText : 'OK',
        headers : { getheaders : 'getHeadersValue' }
      }
    },
    postWithDataWithResponseDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        data : 'Test Data POST request',
        // expected google post header
        headers : {
          "0":{"key":"Content-Type","value":"application/json"},
          "1":{"key":"language","value":"EN"},
          "Accept":"application/json, text/plain, */*",
          "Content-Type":"application/json;charset=utf-8"
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK',
      }
    },
    postWithDataWithOutResponseDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        data : 'Test Data POST request',
        // expected google post header
        headers : {
          'postresponse' : 'requestValue1'
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK',
      }
    },

  };
  return requestStubs;
}]);
