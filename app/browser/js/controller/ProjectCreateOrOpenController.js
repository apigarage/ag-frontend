angular.module('app').controller('ProjectCreateOrOpenCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$state',
  'lodash',
  'Projects',
  function ($scope, $rootScope, $modal, $state, _, Projects){

  init();

  function init(){
    $scope.showCreateProject = false;
    $scope.showOpenProject = false;
    $scope.createProjectError = false;
    $scope.projects = {};

    // TODO: handling of unauthorized or connection issues
    // as discussed this should be covered in the ApiRequest
    // portion of the code

    // Resolves issue where the open project will not go to the app
    // the init() will run as the user moves to another state
    // TODO: a user session handler to track currentProjectId
    if(_.isFinite($rootScope.currentProjectId)) $state.go('app');

    // Not returning the pomise will also resolve the issue
    // But this will make this promise not testable
    // Projects.getAll()
    return Projects.getAll()
      .then(function(projects){
        if(_.isEmpty(projects)){
          $scope.showCreateProject = true;
        }
        else if(projects.length > 0){
          $scope.projects = projects;
          $scope.showOpenProject = true;
        }
      });
  }

  $scope.createProject = function(){
    var projectData = {};
    if(isValidProjectName()){
      projectData.name = $scope.createProject.projectName;
      projectData.description = $scope.createProject.projectDescription;
      $scope.loading = true;
      return Projects.create(projectData)
        .then(function(project){
          $scope.openProject(project.id);
        }
      );
    }
  };

  $scope.openProject = function(projectId){
    $rootScope.currentProjectId = projectId;
    $state.go('app');
  };

  function isValidProjectName(){
    $scope.createProjectError = false;
    if(_.isUndefined($scope.createProject.projectName) ||
      _.isEmpty($scope.createProject.projectName)){
        $scope.createProjectErrorMessage = "Enter valid project name.";
        $scope.createProjectError = true;
        return false;
    }
    return true;
  }

}]);
