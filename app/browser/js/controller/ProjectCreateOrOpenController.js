angular.module('app').controller('ProjectCreateOrOpenCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$q',
  '$state',
  '$window',
  'lodash',
  'Projects',
  'Auth',
  function ($scope, $rootScope, $modal, $q, $state, $window, _, Projects, Auth){

  function init(){
    $scope.showCreateProject = false;
    $scope.showOpenProject = false;
    $scope.createProjectError = false;
    $scope.projects = {};
    $scope.isConnectedToInternet = $window.navigator.onLine;

    // TODO: handling of unauthorized or connection issues
    // as discussed this should be covered in the ApiRequest
    // portion of the code
    return Projects.getAll()
      .then(function(projects){
        if(_.isEmpty(projects)){
          $scope.showCreateProject = true;
          $scope.showProjectListLink = false;
        }
        else if(projects.length > 0){
          $scope.projects = projects;
          $scope.showOpenProject = true;
          $scope.showProjectCreateLink = true;
          $scope.showProjectListLink = false;
        }
      });
  }

  $scope.showCreateProjectForm = function(){
    $scope.showCreateProject = true;
    $scope.showOpenProject = false;
    $scope.showProjectCreateLink = false;
    $scope.showProjectListLink = true;
  };

  $scope.showProjectsListForm = function (){
    init();
  };

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

  $scope.logout = function(){
    Auth.logout();
    $state.go('authentication');
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

  $window.addEventListener("online", function () {
      $scope.isConnectedToInternet = true;
      $rootScope.$digest();
  }, true);

  $window.addEventListener("offline", function () {
      $scope.isConnectedToInternet = false;
      $rootScope.$digest();
  }, true);

  init();
}]);
