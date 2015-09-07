'use strict'
angular.module('app')
.factory('ProjectKeysFixtures', [
  '$httpBackend',
  'Config',
  function($httpBackend, Config){
    var keys = {};
    keys.data = {
      "key1":{
        'id': 1,
        'name': 'key1',
        'project_id': 8
      },
      "key2":{
        'id': 2,
        'name': 'key2'
      },
      "key3":{
        'id': 3,
        'name': 'key3'
      },
      "key4":{
        'id': 4,
        'name': 'key4'
      },
      "key5":{
        'id': 5,
        'name': 'key5'
      },
      "key6":{
        'id': 6,
        'name': 'key6'
      },
      "key7":{
        'id': 7,
        'name': 'key7'
      },
      "key8":{
        'id': 8,
        'name': 'key8'
      },
      "newKey":{
        'id': 9,
        'name': 'newKey',
        'project_id': 1
      },
      "newKeyForProjectWithOneKeyOneEnvironment":{
        'id': 9,
        'name': 'newKey',
        'project_id': 8
      }
    };

    keys.get = function(key){
      return keys.data[key];
    };

    keys.getStub = function(key){
      return keys.stubs[key];
    };

    keys.stubs = {
      "updateKey1Name" : {
        request : {
          method : 'PATCH',
          url : Config.url + 'api/projects/' + keys.get('key1').project_id +
            '/keys/' + keys.get('key1').id,
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          },
          data: {
            'name' : keys.get('key1').name + 'updated'
          }
        },
        response : {
          status : 200,
          data: {
            'id': keys.get('key1').id,
            'name': keys.get('key1').name + 'updated',
            'project_id': keys.get('key1').project_id
          },
          statusText : 'OK',
        }
      },
      "deleteKey1Name" : {
        request : {
          method : 'DELETE',
          url : Config.url + 'api/projects/' + keys.get('key1').project_id +
            '/keys/' + keys.get('key1').id,
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 204,
          data: {},
          statusText : '',
        }
      },
      "createNewKey" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/projects/' + keys.get('newKey').project_id + '/keys',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data: JSON.stringify(
            keys.get('newKey')
          ),
          statusText : 'OK',
        }
      },
      "createNewKeyForProjectWithOneKeyOneEnvironment" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/projects/' +
            keys.get('newKeyForProjectWithOneKeyOneEnvironment').project_id + '/keys',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data: JSON.stringify(
            keys.get('newKeyForProjectWithOneKeyOneEnvironment')
          ),
          statusText : 'OK',
        }
      }
    };

    return keys;
  }]);
