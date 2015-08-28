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
    'UUID',
    'Collections',
    'Items',
    function($rootScope, $q, _, ApiRequest, RequestUtility, Config, UUID,
      Collections, Items){

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
      * add item to given collectionId inside project.collections array
      */
      Project.addItemToCollection = function(collectionId, item){

        if(_.isEmpty($rootScope.currentProject.collections)) return false;
        if(_.isEmpty($rootScope.currentProject.collections[collectionId].items)){
          $rootScope.currentProject.collections[collectionId].items = {};
        }

        item.collection_id = collectionId;
        return Items.create(item).then(function(data){
          $rootScope.currentProject.collections[collectionId].items[data.uuid] = data;
          return data;
        });
      };

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
      * Update item from collectionId (project.collections object)
      * @collectionId = collection where item belongs to
      * @item = item to be updated
      */
      Project.updateItemInCollection = function(collectionId, item){
        // Reset the item in the collection
        $rootScope.currentProject.collections[collectionId].items[item.uuid] = item;
        var data = {
          name: item.name,
          headers: item.headers,
          data: item.data,
          url: item.url,
          method: item.method
        };

        return Items.update(item.uuid, item);
      };


      Project.setNewCollectionForItem = function(oldCollectionId, newCollectionId, itemUUID){
        var item = $rootScope.currentProject.collections[oldCollectionId].items[itemUUID];

        // When the new collection does not have any items, create a new object
        if(! _.isObject($rootScope.currentProject.collections[newCollectionId].items)){
          $rootScope.currentProject.collections[newCollectionId].items = {};
        }

        // The item is removed from the old collection
        delete $rootScope.currentProject.collections[oldCollectionId].items[itemUUID];

        // Reset the item in the new collection
        item.collection_id = newCollectionId;
        $rootScope.currentProject.collections[newCollectionId].items[itemUUID] = item;

        // Make the DB Changes
        var data = {
          collection_id : newCollectionId
        };
        return Items.update(itemUUID, data);
      };

      return Project;
    }
  ]);
