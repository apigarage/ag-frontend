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
        "description": "This is a perfectly fine item.",
        'uuid': 'uuid-uuid-uuid-uuid-1',
        "collection_id": 3
        // other fields will be added, as required.
      },
      "item2":{
        "id": "2",
        "name": "Item 2",
        "description": "This is a perfectly fine item.",
        'uuid': 'uuid-uuid-uuid-uuid-2',
        "collection_id": 3
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
      },
      "itemWithFullDetails":{
        'name': 'request with post and data',
        'uuid': 'uuid-uuid-uuid-uuid-2',
        'url': 'https://abx.xyz',
        'method': 'POST',
        'headers': {
          'key1': 'value1',
          'key2': 'value2'
        },
        'data': 'some data to be sent'
      },
      "itemForSearch":{
        'name': 'Grape',
        'uuid': 'uuid-5'
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
          data: JSON.stringify([
            items.get('item1'),
            items.get('item2'),
            items.get('item3')
          ]),
          statusText : 'OK',
        }
      },
      "createItemWithFullDetails":{
        request : {
          method : 'POST',
          url : Config.url + 'api/items',
          data : JSON.stringify({
            url: items.get('itemWithFullDetails').url,
            name: items.get('itemWithFullDetails').name,
            method: items.get('itemWithFullDetails').method,
            data: items.get('itemWithFullDetails').data,
            uuid: items.get('itemWithFullDetails').uuid,
            headers: items.get('itemWithFullDetails').headers,
            id: items.get('itemWithFullDetails').id,
            collection_id: '2'
          }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data: JSON.stringify(
            items.get('itemWithFullDetails')
          ),
          statusText : 'OK',
        }
      },
      "createItemWithFullDetailsNameUpdated":{
        request : {
          method : 'PATCH',
          url : Config.url + 'api/items/' + items.get('itemWithFullDetails').uuid,
          data : JSON.stringify({
            url: items.get('itemWithFullDetails').url,
            name: items.get('itemWithFullDetails').name + 'updated',
            method: items.get('itemWithFullDetails').method,
            data: items.get('itemWithFullDetails').data,
            uuid: items.get('itemWithFullDetails').uuid,
            headers: items.get('itemWithFullDetails').headers
          }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : JSON.stringify({
            url: items.get('itemWithFullDetails').url,
            name: items.get('itemWithFullDetails').name + 'updated',
            method: items.get('itemWithFullDetails').method,
            data: items.get('itemWithFullDetails').data,
            uuid: items.get('itemWithFullDetails').uuid,
            headers: items.get('itemWithFullDetails').headers,
            collection_id: '2'
          }),
          statusText : 'OK',
        }
      },
      "createItemWithFullDetailsHeadersUpdated":{
        request : {
          method : 'PATCH',
          url : Config.url + 'api/items/' + items.get('itemWithFullDetails').uuid,
          data : JSON.stringify({
            url: items.get('itemWithFullDetails').url,
            name: items.get('itemWithFullDetails').name,
            method: items.get('itemWithFullDetails').method,
            data: items.get('itemWithFullDetails').data,
            uuid: items.get('itemWithFullDetails').uuid,
            headers: {}
          }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 201,
          data : JSON.stringify({
            url: items.get('itemWithFullDetails').url,
            name: items.get('itemWithFullDetails').name,
            method: items.get('itemWithFullDetails').method,
            data: items.get('itemWithFullDetails').data,
            uuid: items.get('itemWithFullDetails').uuid,
            headers: [],
            collection_id: '2'
          }),
          statusText : 'OK',
        }
      },
      "updateCollectionIdTo2" : { // Retrieve List of Items
        request : {
          method : 'PATCH',
          url : Config.url + 'api/items/' +
            items.get('item1').uuid,
          data : JSON.stringify({
            'collection_id': "2"
          }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data: JSON.stringify(items.get('item1')),
          statusText : 'OK',
        }
      },
      "deleteItemId" : {
        request : {
          method : 'DELETE',
          url : Config.url + 'api/items/' +
            items.get('item1').uuid,
        },
        response : {
          status : 200,
          data: JSON.stringify(items.get('item1')),
          statusText : 'OK',
        }
      }
    };
    return items;
  }]);
