angular.module('app')
.factory('UsersFixtures', [
  '$httpBackend',
  'Config',
  function($httpBackend, Config){
  var users = {};
  users.data = {
    userWithExistingEmail : { // NOT USED.
      name: 'some existing name',
      email: 'someEmail@thatworks.com',
      password: 'password'
    },
    userJohnIncorrect: {
      id: 1,
      name: 'John Luke',
      email: 'someEmail@thatworks.comIncorrect',
      accessToken: '894j3jsfa0jl1knuafsd1mlkasfd0h1niajsf',
      password: 'password'
    },
    userJohn: {
      id: 1,
      name: 'John Luke',
      email: 'someEmail@thatworks.com',
      accessToken: '894j3jsfa0jl1knuafsd1mlkasfd0h1niajsf',
      password: 'password'
    }
  };

  users.get = function(key){
    return users.data[key];
  };

  users.getStub = function(key){
    return users.stubs[key];
  };

  users.stubs = {
    "createUserWithExistingEmail" : {
      request : {
        method : 'POST',
        url : Config.url + 'api/users',
        data: JSON.stringify({
          email: users.get('userWithExistingEmail').email,
          password: users.get('userWithExistingEmail').password,
          name: users.get('userWithExistingEmail').name
        }),
        headers : {
          "Content-Type":"application/json;charset=utf-8",
        }
      },
      response : {
        status : 400,
        data : '{"email":["This email is already taken."]}',
        statusText : 'Bad Request',
      }
    },
    "createUserJohnThatWorks": {
      request : {
        method : 'POST',
        url : Config.url + 'api/users',
        data: JSON.stringify({
          email: users.get('userJohn').email,
          password: users.get('userJohn').password,
          name: users.get('userJohn').name
        }),
        headers : {
          "Content-Type":"application/json;charset=utf-8",
        }
      },
      response : {
        status : 200,
        data : JSON.stringify(users.get('userJohn')),
        statusText : 'OK',
      }
    }
  };
  return users;
}]);
