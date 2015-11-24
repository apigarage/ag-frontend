'use strict'
angular.module('app')
.factory('MockingControllerFixtures', [
  '$httpBackend',
  'Config',
  'UUID',
  function($httpBackend, Config, UUID){
    var responses = {};
    responses.data = {
      "responses1": {
        "created_at": "2015-11-23 13:00:34",
        "data": "Endpoint Response Data",
        "deleted_at": null,
        "description": "Description String",
        "headers":
        {
          "key1": "v1"
        },
        "id": "4",
        "item_id": "424",
        "status": "201",
        "updated_at": "2015-11-23 22:13:30",
        "uuid": "cb3b714b-e00c-57e5-c023-ea2662a85b6b"
      },
    };

    responses.get = function(key){
      return responses.data[key];
    };

    responses.getStub = function(key){
      return responses.stubs[key];
    };

    responses.stubs = {
      "responsesList" : { // Retrieve List of Items
        request : {
          method : 'GET',
          // Config.url + Config.api + endpoint + '/'  + endpointUuid + '/' + mockedResponses ,
          url : Config.url + Config.api + 'items/uuid-1/responses',
          headers : {

          }
        },
        response : {
          status : 200,
          data: JSON.stringify([
            responses.get('responses1'),
          ]),
          statusText : 'OK',
        }
      },
    };
    return responses;
  }]);
