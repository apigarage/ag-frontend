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
    'Environments',
    'ProjectKeys',
    'ProjectKeyValues',
    'Collections',
    'Items',
    function($rootScope, $q, _, ApiRequest, RequestUtility, Config, UUID,
      Environments, ProjectKeys, ProjectKeyValues, Collections, Items){

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

      Project.shareProject = function(id, data){
        var options = {
          'method': 'PUT',
          'url': Config.url + Config.api + endpoint + '/' + id,
          'data': data
        };
        return ApiRequest.send(options, false);
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
      d
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

          projectData.collections = Collections.loadAll(projectData.collections);
          projectData.keys = ProjectKeys.loadAll(projectData.keys);
          projectData.environments = Environments.loadAll(projectData.environments);

          // Set the project to rootScope
          $rootScope.currentProject = projectData;
          resetProjectValuesFromRootScope();
          $rootScope.$broadcast('updateSideBar');
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


      //
      // ****************************************************************
      //  currentProject.collections Management
      //  ****************************************************************
      //

      /*
      * add collection to project.collections array
      */
      Project.addCollection = function(collection){
        collection.project_id = $rootScope.currentProject.id;
        return Collections.create(collection).then(function(data){
          if(!_.isObject($rootScope.currentProject.collections)){
            $rootScope.currentProject.collections = {};
          }
          $rootScope.currentProject.collections[data.id] = data;
          $rootScope.$broadcast('updateSideBar');
          return data;
        });
      };

      /*
      * remove collection from project.collections object
      */
      Project.removeCollection = function(collection){
        return Collections.remove(collection.id)
        .then(function(response){
          delete $rootScope.currentProject.collections[collection.id];
          $rootScope.$broadcast('updateSideBar');
          return response;
        });
      };

      /*
      * update collection from project.collections object
      * only collection.name and collection.description can be updated.
      */
      Project.updateCollection = function(collection, data){
        if(data.description){
          $rootScope.currentProject.collections[collection.id].description = data.description;
        }
        if(data.name){
          $rootScope.currentProject.collections[collection.id].name = data.name;
        }
        return Collections.update(collection.id, data)
          .then(function(response){
            $rootScope.$broadcast('updateSideBar');
            return response;
        });
      };

      // ****************************************************************
      //  currentProject.collections.items Management
      //  ****************************************************************

      /*
      * add item to given collectionId inside project.collections array
      */
      Project.addItemToCollection = function(collectionId, item){
        if(_.isEmpty($rootScope.currentProject.collections)) return $q.resolve(false);
        if(_.isEmpty($rootScope.currentProject.collections[collectionId].items)){
          $rootScope.currentProject.collections[collectionId].items = {};
        }
        item.collection_id = collectionId;
        return Items.create(item).then(function(data){
          $rootScope.currentProject.collections[collectionId].items[data.uuid] = data;
          $rootScope.$broadcast('updateSideBar');
          return data;
        });
      };

      /*
      * remove item from given collectionId inside project.collections array
      */
      Project.removeItemFromCollection = function(collectionID, itemUUID){
        return Items.remove(itemUUID).then(function(data){
          delete $rootScope.currentProject.collections[collectionID].items[itemUUID];
          $rootScope.$broadcast('updateSideBar');
          return data;
        });
      };

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
        $rootScope.$broadcast('updateSideBar');
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
        $rootScope.$broadcast('updateSideBar');
        return Items.update(itemUUID, data);
      };

      //
      // ****************************************************************
      //  currentProject.environments Management
      //  ****************************************************************
      //
      Project.addNewEnvironment = function(environment){
        return Environments.create($rootScope.currentProject.id, environment)
          .then(function(){
            // If no key exists, create a project keys.
            if( _.isEmpty($rootScope.currentProject.keys)){
              var variable = {name: ''};
              return Project.addNewVariable(variable);
            }
          });
      };

      Project.updateEnvironment = function(environment){
        var data = {
          name: environment.name
        };

        return Environments.update($rootScope.currentProject.id, environment.id, data);
      };

      Project.deleteEnvironment = function(environment){
        return Environments.remove($rootScope.currentProject.id, environment.id);
      };

      Project.addNewVariable = function(variable){
        return ProjectKeys.create($rootScope.currentProject.id, variable);
      };

      Project.updateVariable = function(variable){
        var data = {
          name: variable.name
        };

        return ProjectKeys.update($rootScope.currentProject.id, variable.id, data);
      };

      Project.deleteVariable = function(variable){
        return ProjectKeys.remove($rootScope.currentProject.id, variable.id);
      };

      Project.updateVariableEnvironmentValue = function(variableId, environmentId, value){
        var data = {
          'value': value
        };
        return ProjectKeyValues.update(
          $rootScope.currentProject.id, variableId, environmentId, data
        );
      };

      return Project;
    }
  ]);
