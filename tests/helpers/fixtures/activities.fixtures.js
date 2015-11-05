'use strict'
angular.module('app')
.factory('ActivitiesFixtures', [
  '$httpBackend',
  'Config',
  function($httpBackend, Config){
    var activities = {};
    activities.data = {
      "activitiesWithData" :
      [
        {
          "id": "1",
          "uuid": "231259b0-e64e-538c-45f7-f9816ed054d2",
          "user_id": "31",
          "item_id": "424",
          "comment_type_id": "1",
          "description": "test 123",
          "created_at": "2015-10-23 08:38:38",
          "updated_at": "2015-10-30 15:02:58",
          "activity_type": {
            "id": "1",
            "name": "comment",
            "description": "A comment",
            "created_at": "2015-10-23 08:38:14",
            "updated_at": "2015-10-23 08:38:14"
          },
          "user": {
            "created_at": "2015-08-04 10:19:44",
            "updated_at": "2015-08-04 10:19:44",
            "id": "31",
            "name": "zad",
            "email": "zadkiel.m@gmail.com",
            "deleted_at": null
          }
        },
        {
          "id": "201",
          "uuid": "8839ffc6-cb9b-fbe6-cc30-0ab63ae336e8",
          "user_id": "31",
          "item_id": "424",
          "comment_type_id": "3",
          "description": "updated comment",
          "created_at": "2015-10-28 11:09:32",
          "updated_at": "2015-10-30 15:28:00",
          "activity_type": {
            "id": "3",
            "name": "resolve",
            "description": "a flag has been resolved",
            "created_at": "2015-10-23 08:38:14",
            "updated_at": "2015-10-23 08:38:14"
          },
          "user": {
            "created_at": "2015-08-04 10:19:44",
            "updated_at": "2015-08-04 10:19:44",
            "id": "31",
            "name": "zad",
            "email": "zadkiel.m@gmail.com",
            "deleted_at": null
          }
        },
        {
          "id": "218",
          "uuid": "aefe213c-4a43-8046-7421-8b44668b9c39",
          "user_id": "1",
          "item_id": "424",
          "comment_type_id": "2",
          "description": null,
          "created_at": "2015-10-29 10:57:31",
          "updated_at": "2015-10-29 10:57:31",
          "activity_type": {
            "id": "2",
            "name": "flag",
            "description": "A flag has been raised",
            "created_at": "2015-10-23 08:38:14",
            "updated_at": "2015-10-23 08:38:14"
          },
          "user": {
            "created_at": "2015-05-11 21:17:09",
            "updated_at": "2015-05-11 21:17:09",
            "id": "1",
            "name": "Chinmay",
            "email": "chinmay@chinmay.ca",
            "deleted_at": null
          }
        },
        {
          "id": "219",
          "uuid": "dba92d76-cbea-49fe-0d60-765677c1779a",
          "user_id": "1",
          "item_id": "424",
          "comment_type_id": "2",
          "description": null,
          "created_at": "2015-10-29 10:58:49",
          "updated_at": "2015-10-29 10:58:49",
          "activity_type": {
            "id": "2",
            "name": "flag",
            "description": "A flag has been raised",
            "created_at": "2015-10-23 08:38:14",
            "updated_at": "2015-10-23 08:38:14"
          },
          "user": {
            "created_at": "2015-05-11 21:17:09",
            "updated_at": "2015-05-11 21:17:09",
            "id": "1",
            "name": "Chinmay",
            "email": "chinmay@chinmay.ca",
            "deleted_at": null
          }
        }
      ]
    }
  ;

    activities.get = function(key){
      return activities.data[key];
    };

    activities.getStub = function(key){
      return activities.stubs[key];
    };

    activities.stubs = {
      "activitiesList" : { // Retrieve List of activities
        request : {
          method : 'GET',
          url : Config.url + 'api/items' + '/uuid-uuid-uuid-uuid-1' +
            '/activities',
          headers : {}
        },
        response : {
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          },
          status : 200,
          data: JSON.stringify(activities.get('activitiesWithData')),
          statusText : 'OK',
        }
      },
      "activitiesListNoConnection" : { // Retrieve List of activities
        request : {
          method : 'GET',
          url : Config.url + 'api/items' + '/uuid-uuid-uuid-uuid-1' +
            '/activities',
          headers : {}
        },
        response : {
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          },
          status : 500,
          statusText : 'Whoops! There was an error.',
        }
      }
    };

    return activities;
  }]);
