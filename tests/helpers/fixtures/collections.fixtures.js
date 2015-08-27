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
          ItemsFixtures.get('itemWithFullDetails')
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
      },
      "newCollection":{
        "id": "8",
        "name": "New collection",
        "project_id": "5",
        "description": "Use to test newly created collections"
      },
      "newCollectionEmptyProject":{
        "id": "9",
        "name": "New collection Empty project",
        "project_id": "1",
        "description": "Use to test newly created collections"
      },
      "searchCollection":{
        "id": 1,
        "name": "Fruit",
        items : [
          ItemsFixtures.get('item1'),
          ItemsFixtures.get('item2'),
          ItemsFixtures.get('itemForSearch')
        ]
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
      },
      "createNewCollectionForEmptyProject" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/collections',
          headers : {"Content-Type":"application/json;charset=utf-8"},
          data: JSON.stringify({
            name: collections.get('newCollectionEmptyProject').name,
            project_id: collections.get('newCollectionEmptyProject').project_id
          }),
        },
        response : {
          status : 200,
          data: JSON.stringify(
            collections.get('newCollectionEmptyProject')
          ),
          statusText : 'OK'
        }
      },
      "createNewCollection" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/collections',
          headers : {"Content-Type":"application/json;charset=utf-8"},
          data: JSON.stringify({
            name: collections.get('newCollection').name,
            project_id: collections.get('newCollection').project_id
          }),
        },
        response : {
          status : 200,
          data: JSON.stringify(
            collections.get('newCollection')
          ),
          statusText : 'OK'
        }
      },
    };
    return collections;
  }]);
