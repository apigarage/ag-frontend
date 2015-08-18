'use strict';
angular.module('app')
.factory('CollectionsFixtures', [
  '$httpBackend',
  'Config',
  'ItemsFixtures',
  function($httpBackend, Config, ItemsFixtures){
    var collections = {};
    collections.data = {
      "collectionWithNoItems": {
        "id": "1",
        "name": "Collection 1",
        "description": "This is a perfectly fine collection."
      },
      "collectionWithOneItems":{
        "id": "2",
        "name": "Collection 2",
        "description": "This is a perfectly fine collection.",
        "items": [
          ItemsFixtures.get('item1')
        ]
      },
      "collectionWithTwoItems":{
        "id": "3",
        "name": "Collection 3",
        "description": "This is a perfectly fine collection.",
        "items": [
          ItemsFixtures.get('item1'),
          ItemsFixtures.get('item2')
        ]
      },
      "collectionWithThreeItems":{
        "id": "4",
        "name": "Collection 4",
        "description": "This is a perfectly fine collection.",
        "items": [
          ItemsFixtures.get('item1'),
          ItemsFixtures.get('item2'),
          ItemsFixtures.get('item3')
        ]
      },
      "collection1":{
        "id": "5",
        "name": "Collection 1",
        "description": "This is a perfectly fine collection."
      },
      "collection2":{
        "id": "6",
        "name": "Collection 2",
        "description": "This is a perfectly fine collection."
      },
      "collection3":{
        "id": "7",
        "name": "Collection 3",
        "description": "This is a perfectly fine collection."
      }
    };

    collections.get = function(key){
      return collections.data[key];
    };

    collections.getStub = function(key){
      return collections.stubs[key];
    };

    collections.stubs = {
      "collectionList" : { // Retrieve List of Collections
        request : {
          method : 'GET',
          url : Config.url + 'api/collections',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data: JSON.stringify(
            collections.get('collection1'),
            collections.get('collection2'),
            collections.get('collection3')
          ),
          statusText : 'OK',
        }
      }
    };
    return collections;
  }]);
