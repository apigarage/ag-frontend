'use strict';
angular.module('app')

.factory('ProjectsFixtures', [
  '$httpBackend',
  'Config',
  'ItemsFixtures',
  'CollectionsFixtures',
  'ProjectKeysFixtures',
  'EnvironmentsFixtures',
  function($httpBackend, Config, ItemsFixtures, CollectionsFixtures,
    ProjectKeysFixtures, EnvironmentsFixtures){
    var projects = {};

    projects.get = function(key){
      return projects.data[key];
    };

    projects.getStub = function(key){
      return projects.stubs[key];
    };

    projects.getList = function(key){
      return projects.list[key];
    };

    projects.data = {
      "projectEmpty": {
        "id": "1",
        "name": "Project 1",
        "description": "This is a perfectly fine project.",
      },
      "projectWithTwoCollectionNoItems": {
        "id": "2",
        "name": "Project 1",
        "description": "This is a perfectly fine project.",
        "collections":[
          CollectionsFixtures.get('collectionWithTwoItems'),
          CollectionsFixtures.get('collectionWithOneItems')
        ]
      },
      "projectWithNoCollectionsAndTwoItems": {
        "id": "3",
        "name": "Project 1",
        "description": "This is a perfectly fine project.",
        "items":[
          ItemsFixtures.get('item1'),
          ItemsFixtures.get('item2')
        ]
      },
      "projectWithTwoCollectionsAndOneItem": {
        "id": "4",
        "name": "Project 1",
        "description": "This is a perfectly fine project.",
        "collections":[
          CollectionsFixtures.get('collection1'),
          CollectionsFixtures.get('collection2')
        ],
        "items":[
          ItemsFixtures.get('item1')
        ]
      },
      "project2":{
        "id": "5",
        "name": "Project 2",
        "description": "This is a perfectly fine project.",
      },
      "project3":{
        "id": "6",
        "name": "Project 3",
        "description": "This is a perfectly fine project.",
      },
      "searchProject":{
        "id": "1",
        "name": "Search Project",
        "collections":[
          CollectionsFixtures.get('searchCollection'),
        ]
      },
      "projectWithOneKeyOneEnvironment":{
        "id": "8",
        "name": "Project with one key and one environments",
        "description": "This is a perfectly fine project.",
        "keys":[
          ProjectKeysFixtures.get('key1')
        ],
        "environments": [
            EnvironmentsFixtures.get('environment-public'),
            EnvironmentsFixtures.get('environment-private')
        ]
        // TODO - Environments TO BE ADDED
      },
    };

    projects.list = {
      "list1":[
        projects.get('project1'),
        projects.get('project2'),
        projects.get('project3')
      ]
    };

    projects.stubs = {
      "projectList" : { // Retrieve List of Projects
        request : {
          method : 'GET',
          url : Config.url + 'api/projects',
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data: JSON.stringify(
            projects.get('projectList')
          ),
          statusText : 'OK',
        }
      },
      "noHeadersProjectList" : {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects',
          headers : {}
        },
        response : {
          status : 200,
          data: JSON.stringify([
            projects.get('projectEmpty')
          ]),
          statusText : 'OK',
        }
      },
      "createProject" : {
        request : {
          method : 'POST',
          url : Config.url + 'api/projects',
          headers : {"Content-Type":"application/json;charset=utf-8"},
          data: JSON.stringify({
            name: projects.get('projectEmpty').name,
            description: projects.get('projectEmpty').description,
          }),
        },
        response : {
          status : 200,
          data: JSON.stringify([
            projects.get('projectEmpty')
          ]),
          statusText : 'OK'
        }
      },
      "emptyProjectList" : {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects',
          headers : {
          }
        },
        response : {
          status : 200,
          data: [],
          statusText : 'OK',
        }
      },
      "getProjectWithOneKeyOneEnvironment": {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects/' +
            projects.get('projectWithOneKeyOneEnvironment').id,
        },
        response : {
          status : 200,
          data: JSON.stringify(
            projects.get('projectWithOneKeyOneEnvironment')
          ),
          statusText : 'OK',
        }
      },
      "getEmptyProject": {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects/' +
            projects.get('projectEmpty').id,
        },
        response : {
          status : 200,
          data: JSON.stringify(
            projects.get('projectEmpty')
          ),
          statusText : 'OK',
        }
      },
      "retreiveProjectWithTwoCollectionsAndOneItem": {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects/' +
            projects.get('projectWithTwoCollectionsAndOneItem').id,
        },
        response : {
          status : 200,
          data: JSON.stringify(
            projects.get('projectWithTwoCollectionsAndOneItem')
          ),
          statusText : 'OK',
        }
      },
      "retrieveProjectWithTwoCollectionNoItems": {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects/' +
            projects.get('projectWithTwoCollectionNoItems').id,
        },
        response : {
          status : 200,
          data: JSON.stringify(
            projects.get('projectWithTwoCollectionNoItems')
          ),
          statusText : 'OK',
        }
      },
      "retrieveProjectForSearch": {
        request : {
          method : 'GET',
          url : Config.url + 'api/projects/' +
            projects.get('searchProject').id,
        },
        response : {
          status : 200,
          data: JSON.stringify(
            projects.get('searchProject')
          ),
          statusText : 'OK',
        }
      }
    };
    return projects;
  }]);
