'use strict';

/* Services */

angular.module('app')
  .factory('Projects', [
    '$rootScope',
    '$q',
    'lodash',
    'ApiRequest',
    'RequestUtility',
    'Config',
    'Collections',
    'Items',
    function($rootScope, $q, _, ApiRequest, RequestUtility, Config, Collections, Items){

      var endpoint = 'projects';

      var Project = {};
      /*
      * @params: key value pair of params
      */
      Project.getAll = function(params){
        var url = Config.url + Config.api + endpoint;
        if(params) url += '?' + $.param(params) // jshint ignore:line
        var options = {
          'method': 'GET',
          'url': url
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      */
      Project.get = function(id){
        var options = {
          'method': 'GET',
          'url': Config.url + Config.api + endpoint + '/' + id
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      * @data: object fields and values
      */
      Project.update = function(id, data){

        var options = {
          'method': 'PATCH',
          'url': Config.url + Config.api + endpoint + '/' + id,
          'data': data
        };
        return ApiRequest.send(options);
      };

      /*
      * @data: object fields and values
      */
      Project.create = function(data){
        var options = {
          'method': 'POST',
          'url': Config.url + Config.api + endpoint,
          'data': data
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      */
      Project.remove = function(id){
        var options = {
          'method': 'DELETE',
          'url': Config.url + Config.api + endpoint + '/' + id
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: retrieves the project, and sets it to currentProject on rootScope
      */
      Project.loadProjectToRootScope = function(id){
        return Project.get(id)
        .then(function(projectData){
          // If there is any project transformations, it should happen here.

          // Transforming project.collections from an array to an object.
          // collection_id will be the key.
          projectData.collections = _.reduce(projectData.collections, function(result, collection){
            if(collection.id){

              // Transforming collection.items from an array to an object.
              // items.uuid will be the key.
              collection.items = _.reduce(collection.items, function(itemResult, item){
                if(item.uuid){
                  itemResult[item.uuid] = item;
                }
                return itemResult;
              }, {});
              result[collection.id] = collection;

            }
            return result;
          }, {});

          // Set the project to rootScope
          $rootScope.currentProject = projectData;
          resetProjectValuesFromRootScope();
        });
      };

      function resetProjectValuesFromRootScope(){
        $rootScope.currentCollection = {};
        $rootScope.currentItem = {};
        $rootScope.$broadcast('loadPerformRequest', {});
      }

      //
      // ****************************************************************
      //  * Project Management (with collections, items, and environments)
      //  * Uses $rootScope.currentProject to do the operations
      //  ****************************************************************
      //
      /*
      * add collection to project.collections array
      */
      Project.addCollection = function(collection){
        if(!_.isObject($rootScope.currentProject.collections)){
          $rootScope.currentProject.collections = {};
        }
        $rootScope.currentProject.collections[collection.id] = collection;
      };

      /*
      * remove collection from project.collections array
      */
      // Project.removeCollection = function(collectionId){
      //   // TODO - Add to DB
      //   if(!_.isObject($rootScope.collections)) return false;
      //   delete $rootScope.collections[collectionId];
      // };

      /*
      * update collection from project.collections array
      */
      Project.updateCollection = function(collectionId, data){
        // TODO - Add to DB
        if(data.description){
          $rootScope.currentProject.collections[collectionId].description = data.description;
        }
        if(data.name){
          $rootScope.currentProject.collections[collectionId].name = data.name;
        }
      };

      /*
      * adds item to project.items array
      */
      // Project.addItem = function(item){
      //   // TODO - Add to DB
      //   if(!_.isArray($rootScope.items)){
      //     $rootScope.itemjs = [];
      //   }
      //   return $rootScope.items.push(item);
      // };

      /*
      * remove item from project.items array
      */
      // Project.removeItem = function(itemUUID){
      //   // TODO - Remove from DB
      //   if(!_.isArray($rootScope.items)) return false;
      //   $rootScope.items = _.reject($rootScope.items, function(item){
      //     return (item.uuid === itemUUID);
      //   });
      //   return true;
      // };

      /*
      * add item to given collectionId inside project.collections array
      */
      // Project.addItemToCollection = function(collectionId, item){
      //   // TODO - Add to DB
      //   if(!_.isArray($rootScope.collections)) return false;
      //
      //   $rootScope.collections.forEach(function(collection, index, array){
      //     if(collection.id !== collectionId) return;
      //     if(!_.isArray(collection.items)) array.items = [];
      //     array.items.push(item);
      //   });
      // };

      /*
      * remove item from given collectionId inside project.collections array
      */
      // Project.removeItemFromCollection = function(collectionId, itemUUID){
      //   // TODO - Remove from DB
      //   if(!_.isArray($rootScope.collections)) return false;
      //   $rootScope.collections.forEach(function(collection, collectionIndex, array){
      //     if(collection.id !== collectionId) return;
      //     if(!_.isArray(collection.items)) return;
      //
      //     array[collectionIndex].items = _.reject(collection.items, function(item){
      //       return (item.uuid === itemUUID);
      //     });
      //   });
      // };

      /*
      * update item from collectionId, project.collections array
      * if changes.newCollectionId ---> Changes the owner collection of the item
      * if changes.name ---> Changes name of the item
      * if changes.description ---> Changes description of the item
      * if changes.headers ---> Changes headers of the item
      * if changes.body ---> Changes body of the item
      * if changes.method ---> Changes method of the item
      */
      Project.updateItem = function(collectionId, itemUUID, changes){
        var data = changes; // Used for API Payload. Assigns name, headers, data, description.
        var item = $rootScope.currentProject.collections[collectionId].items[itemUUID];

        if(changes.newCollectionId){
          // When collections does not have any items
          if(! _.isObject($rootScope.currentProject.collections[changes.newCollectionId].items)){
            $rootScope.currentProject.collections[changes.newCollectionId].items = {};
          }

          // The item is moved from to new collection.
          $rootScope.currentProject.collections[changes.newCollectionId].items[itemUUID] = item;
          delete $rootScope.currentProject.collections[collectionId].items[itemUUID];

          // Assign data for DB update
          data.collection_id = changes.newCollectionId;
          delete data.newCollectionId;
        }

        if(changes.headers){
          data.headers = RequestUtility.getHeaders(changes.headers, 'string');
          // TODO - do headers transformation using RequestUtility
        }

        return Items.update(itemUUID, data);
      };

      return Project;
    }
  ]);
