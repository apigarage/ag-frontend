angular.module('app')
.factory('AuthFixtures', [
  '$httpBackend',
  'Config',
  'UsersFixtures',
  function($httpBackend, Config, UsersFixtures){
  var auth = {};

  auth.stubs = {
    "loginUserJohn": {
      request : {
        method : 'POST',
        url : Config.url + 'oauth/token',
        data: $.param({
          username: UsersFixtures.get('userJohn').email,
          password: UsersFixtures.get('userJohn').password,
          client_id: Config.client_id,
          client_secret: Config.client_secret,
          grant_type: "password"
        }),
        headers : {
          "Content-Type":"application/x-www-form-urlencoded",
        }
      },
      response : {
        status : 201,
        data : JSON.stringify({
          "access_token": UsersFixtures.get('userJohn').accessToken,
          "token_type": "Bearer",
          "expires_in": 7776000
        }),
        statusText : 'OK',
      }
    },
    "loginThatDoesNotWork": {
      request : {
        method : 'POST',
        url : Config.url + 'oauth/token',
        data: $.param({
          username: UsersFixtures.get('userJohnIncorrect').email,
          password: UsersFixtures.get('userJohnIncorrect').password,
          client_id: Config.client_id,
          client_secret: Config.client_secret,
          grant_type: "password"
        }),
        headers : {
          "Content-Type":"application/x-www-form-urlencoded",
        }
      },
      response : {
        status : 401,
        statusText : 'Unauthorized'
      }
    }
  };

  auth.getStub = function(key){
    return auth.stubs[key];
  };
  return auth;
}]);
