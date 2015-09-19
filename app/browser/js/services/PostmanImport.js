'use strict';

/* Services */

angular.module('app')
  .factory('PostmanImport', [ 'ApiRequest', 'Config', 'Auth', 'FileUploader', function( ApiRequest, Config, Auth, FileUploader){
    var endpoint = 'postman';
    var serviceUploader = null;

    var init = function(){
      serviceUploader = new FileUploader();
      serviceUploader.url = Config.url + Config.api + endpoint;
      serviceUploader.headers = { 'Authorization' : Auth.get() };
    };

    var save = function(){
      return serviceUploader.uploadAll();
    };

    return{
      init:init,
      save:save,
      serviceUploader: function(){ return serviceUploader; }
    };

  }]);
