'use strict'
angular.module('app')
.factory('EnvironmentsFixtures', [
  '$httpBackend',
  'Config',
  function($httpBackend, Config){
    var environments = {};
    environments.data = {
      "environment1":{
        'id': 1,
        'name': 'environment1',
        'project_id': 8
      },
      "environment-private":{
        'id': 2,
        'name': 'environment private',
        'private': true,
        'project_id': 8
      },
      "environment-public":{
        'id': 3,
        'name': 'environment public',
        'private': false,
        'project_id': 8
      },
      "environment4":{
        'id': 4,
        'name': 'environment4'
      },
      "environment5":{
        'id': 5,
        'name': 'environment5'
      },
      "environment6":{
        'id': 6,
        'name': 'environment6'
      },
      "environment7":{
        'id': 7,
        'name': 'environment7'
      },
      "environment8":{
        'id': 8,
        'name': 'environment8'
      },
      "newPrivateEnvironment":{
        'id': 9,
        'name': 'newEnvironment',
        'private': true,
        'project_id': 1
      },
      "newPublicEnvironment":{
        'id': 9,
        'name': 'newEnvironment',
        'private': false,
        'project_id': 1
      },
      "newEnvironmentForProjectWithOneKeyOneEnvironment":{
        'id': 9,
        'name': 'newEnvironment',
        'project_id': 8
      }
    };

    environments.get = function(environment){
      return environments.data[environment];
    };

    environments.getStub = function(environment){
      return environments.stubs[environment];
    };

    environments.stubs = {
      "updateEnvironmentPrivate" : {
        request : {
          method : 'PATCH',
          url : Config.url + 'api/projects/' + environments.get('environment-private').project_id +
            '/environments/' + environments.get('environment-private').id,
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          },
          data: {
            'name' : environments.get('environment-private').name + 'updated'
          }
        },
        response : {
          status : 200,
          data: {
            'id': environments.get('environment-private').id,
            'name': environments.get('environment-private').name + 'updated',
            'project_id': environments.get('environment-private').project_id,
            'private': environments.get('environment-private').private
          },
          statusText : 'OK',
        }
      },
      "updateEnvironmentPublic" : {
        request : {
          method : 'PATCH',
          url : Config.url + 'api/projects/' + environments.get('environment-public').project_id +
            '/environments/' + environments.get('environment-public').id,
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          },
          data: {
            'name' : environments.get('environment-public').name + 'updated'
          }
        },
        response : {
          status : 200,
          data: {
            'id': environments.get('environment-public').id,
            'name': environments.get('environment-public').name + 'updated',
            'project_id': environments.get('environment-public').project_id,
            'private': environments.get('environment-public').private
          },
          statusText : 'OK',
        }
      },
      "deleteEnvironmentPrivate" : {
        request : {
          method : 'DELETE',
          url : Config.url + 'api/projects/' + environments.get('environment-private').project_id +
            '/environments/' + environments.get('environment-private').id,
          headers : {}
        },
        response : {
          status : 204,
          data: {},
          statusText : 'No Content'
        }
      },
      "deleteEnvironmentPublic" : {
        request : {
          method : 'DELETE',
          url : Config.url + 'api/projects/' + environments.get('environment-public').project_id +
            '/environments/' + environments.get('environment-public').id,
          headers : {}
        },
        response : {
          status : 204,
          data: {},
          statusText : 'No Content'
        }
      },
      "createNewPublicEnvironment" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/projects/' + environments.get('newPublicEnvironment').project_id + '/environments',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data: JSON.stringify(
            environments.get('newPublicEnvironment')
          ),
          statusText : 'OK',
        }
      },
      "createNewPrivateEnvironment" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/projects/' + environments.get('newPrivateEnvironment').project_id + '/environments',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data: JSON.stringify(
            environments.get('newPrivateEnvironment')
          ),
          statusText : 'OK',
        }
      },
      "createNewEnvironmentForProjectWithOneKeyOneEnvironment" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/projects/' +
            environments.get('newEnvironmentForProjectWithOneKeyOneEnvironment').project_id +
           '/environments',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data: JSON.stringify(
            environments.get('newEnvironmentForProjectWithOneKeyOneEnvironment')
          ),
          statusText : 'OK',
        }
      }
    };

    return environments;
  }]);
