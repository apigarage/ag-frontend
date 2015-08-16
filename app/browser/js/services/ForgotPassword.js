'use strict';

/* Services */

angular.module('app')
  .factory('ForgotPassword', [
    'ApiRequest',
    'Config',
    '$httpBackend',
    function($httpBackend, ApiRequest, Config){
    var endpoint = 'users';

     /* @data: object fields and values */
    var sendCodeRequest = function(data){
      var options = {
          'method': 'POST',
          'url': 'http://localhost/',
          'data': data
      };
      return ApiRequest.send(options)
                      .then(function(data){
                        return data;
                      });
    };

    var verifyCodeRequest = function(data){
      var options = {
          'method': 'POST',
          'url': 'http://localhost/',
          'data': data
      };
      return ApiRequest.send(options)
                      .then(function(data){
                        return data;
                      });
    };

    var resetPassword = function(data){
      var options = {
          'method': 'POST',
          'url': 'http://localhost/',
          'data': data
      };
      return ApiRequest.send(options)
                      .then(function(data){
                        return data;
                      });
    };

    var sendCodeRequestTest = function(){
      return $httpBackend.expect(
          'request.method',
          'request.url',
          'request.data',
          'request.headers')
        .respond(
          'result.status',
          'result.data',
          'result.headers',
          'result.statusTextt'
        );
    };

    return{
      sendCodeRequest : sendCodeRequest,
      sendCodeRequestTest : sendCodeRequestTest
    };

  }]);
