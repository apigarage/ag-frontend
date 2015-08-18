'use strict'
angular.module('app')
.factory('ItemsFixtures', [
  '$httpBackend',
  'Config',
  function($httpBackend, Config){
    var items = {};
    items.data = {
      "item1": {
        "id": "1",
        "name": "Item 1",
        "description": "This is a perfectly fine item."
        // other fields will be added, as required.
      },
      "item2":{
        "id": "2",
        "name": "Item 2",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      },
      "item3":{
        "id": "3",
        "name": "Item 3",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      },
      "item4":{
        "id": "4",
        "name": "Item 4",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      },
      "item5":{
        "id": "5",
        "name": "Item 5",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      },
      "item6":{
        "id": "6",
        "name": "Item 6",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      },
      "item7":{
        "id": "7",
        "name": "Item 7",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      },
      "item8":{
        "id": "8",
        "name": "Item 8",
        "description": "This is a perfectly fine item.",
        // other fields will be added, as required.
      }
    };

    items.get = function(key){
      return items.data[key];
    };

    items.getStub = function(key){
      return items.stubs[key];
    };

    items.stubs = {
      "itemList" : { // Retrieve List of Items
        request : {
          method : 'GET',
          url : Config.url + 'api/items',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data: JSON.stringify(
            items.get('item1'),
            items.get('item2'),
            items.get('item3')
          ),
          statusText : 'OK',
        }
      }
    };
    return items;
  }]);
