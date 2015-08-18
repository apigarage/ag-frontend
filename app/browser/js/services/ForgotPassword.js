'use strict';

/* Services */

angular.module('app')
  .factory('ForgotPassword', [
    'ApiRequest',
    'Config',
    '$rootScope',
    function(ApiRequest, Config, $rootScope){

     /* @data: object fields and values */
    var sendCodeRequest = function(data){
      var options = {
          'method': 'POST',
          'url': Config.url + Config.api + 'send_reset_code',
          'data': data
      };
      return ApiRequest.send(options, false)
                      .then(function(data){
                        return data;
                      });
    };

    var verifyCodeRequest = function(data){
      var options = {
          'method': 'POST',
          'url': Config.url + Config.api + 'verify_code',
          'data': data
      };
      return ApiRequest.send(options, false)
                      .then(function(data){
                        return data;
                      });
    };

    var resetPassword = function(data){
      var options = {
          'method': 'POST',
          'url': Config.url + Config.api + 'reset_password',
          'data': data
      };
      return ApiRequest.send(options, false)
                      .then(function(data){
                        return data;
                      });
    };

    var setForgotPassword = function(option){
      $rootScope.forgotPassword = option;
    };

    return{
      sendCodeRequest : sendCodeRequest,
      verifyCodeRequest : verifyCodeRequest,
      resetPassword : resetPassword,
      setForgotPassword : setForgotPassword
    };

  }]);
