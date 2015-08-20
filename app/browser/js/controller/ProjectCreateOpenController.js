angular.module('app').controller('ProjectCreateOpenCtrl', [
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
    $scope.selectedProjectId = undefined;
    $scope.createProjectError = false;
    $scope.projects = {};
    // TODD: handling of unauthorized or connection issues
    // as discussed this should be covered in the ApiRequest
    // portion of the code
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
          $scope.selectedProjectId = project.id;
          $scope.openProject();
        }
      );
    }
  };

  $scope.openProject = function(projectId, $index){
    $rootScope.currentProjectId = $scope.selectedProjectId;
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
