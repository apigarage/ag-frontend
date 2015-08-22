'use strict';

/* Services */

angular.module('app')
  .factory('Projects', [
    '$rootScope',
    '$q',
    'lodash',
    'ApiRequest',
    'Config',
    'Collections',
    'Items',
    function($rootScope, $q, _, ApiRequest, Config, Collections, Items){

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
          $rootScope.currentProject = projectData;
          resetProjectValuesFromRootScope();
        });
      };

      function resetProjectValuesFromRootScope(){
        $rootScope.currentCollection = {};
        $rootScope.currentItem = {};
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
        // TODO - Add to DB
        if(!_.isArray($rootScope.collections)){
          $rootScope.collections = [];
        }
        return $rootScope.collections.push(collection);
      };

      /*
      * remove collection from project.collections array
      */
      Project.removeCollection = function(collectionId){
        // TODO - Remove from DB
        if(!_.isArray($rootScope.collections)) return false;
        $rootScope.collections = _.reject( $rootScope.collections, function(collection){
          return (collection.id === collectionId);
        });
        return true;
      };

      /*
      * update collection from project.collections array
      */
      Project.removeCollection = function(collectionId){
        // TODO - Update from DB
        if(!_.isArray($rootScope.collections)) return false;
        $rootScope.collections = _.reject( $rootScope.collections, function(collection){
          return (collection.id === collectionId);
        });
        return true;
      };

      /*
      * adds item to project.items array
      */
      Project.addItem = function(item){
        // TODO - Add to DB
        if(!_.isArray($rootScope.items)){
          $rootScope.itemjs = [];
        }
        return $rootScope.items.push(item);
      };

      /*
      * remove item from project.items array
      */
      Project.removeItem = function(itemUID){
        // TODO - Remove from DB
        if(!_.isArray($rootScope.items)) return false;
        $rootScope.items = _.reject($rootScope.items, function(item){
          return (item.uid === itemUID);
        });
        return true;
      };

      /*
      * add item to given collectionId inside project.collections array
      */
      Project.addItemToCollection = function(collectionId, item){
        // TODO - Add to DB
        if(!_.isArray($rootScope.collections)) return false;

        $rootScope.collections.forEach(function(collection, index, array){
          if(collection.id !== collectionId) return;
          if(!_.isArray(collection.items)) array.items = [];
          array.items.push(item);
        });
      };

      /*
      * remove item from given collectionId inside project.collections array
      */
      Project.removeItemFromCollection = function(collectionId, itemUID){
        // TODO - Remove from DB
        if(!_.isArray($rootScope.collections)) return false;
        $rootScope.collections.forEach(function(collection, collectionIndex, array){
          if(collection.id !== collectionId) return;
          if(!_.isArray(collection.items)) return;

          array[collectionIndex].items = _.reject(collection.items, function(item){
            return (item.uid === itemUID);
          });
        });
      };


      return Project;
    }
  ]);
