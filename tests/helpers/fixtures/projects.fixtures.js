'use strict';
angular.module('app')
.factory('ProjectsFixtures', [
  '$httpBackend',
  'Config',
  'ItemsFixtures',
  'CollectionsFixtures',
  function($httpBackend, Config, ItemsFixtures, CollectionsFixtures){
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
      "projectWithOneCollectionNoItems": {
        "id": "2",
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
      }
    };
    return projects;
  }]);
