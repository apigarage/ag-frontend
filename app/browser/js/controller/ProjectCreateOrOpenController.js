angular.module('app').controller('ProjectCreateOrOpenCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$q',
  '$state',
  '$window',
  'lodash',
  'Projects',
  'PostmanImport',
  'Auth',
  'Analytics',
  'Users',
  function ($scope, $rootScope, $modal, $q, $state, $window, _, Projects,
    PostmanImport, Auth, Analytics, Users){

  function init(){
    $scope.showCreateProject = false;
    $scope.showOpenProject = false;
    $scope.createProjectError = false;
    $scope.showImportPostmanProjectLink = true;
    PostmanImport.init();
    $scope.uploader = PostmanImport.serviceUploader();
    $scope.uploader.removeAfterUpload = true;
    $scope.uploader.onCompleteAll = onUploadComplete;
    $scope.uploader.onErrorItem = onUploadError;
    $scope.uploader.onProgressItem = onProgressItem;
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
          $scope.showImportPostmanProject = false;
        }
        else if(projects.length > 0){
          $scope.projects = projects;
          $scope.showOpenProject = true;
          $scope.showProjectCreateLink = true;
          $scope.showProjectListLink = false;
          $scope.showImportPostmanProject = false;
        }
        // Analytics identify USER
        Users.getCurrentUserInformation().then(function(user){
          Analytics.setUser(user);
          // store current user to localStorage
          localStorage.setItem("currentUser", JSON.stringify(user));
        });
        // Analytics start user session
        Analytics.startSession();
      });
  }

  function onUploadComplete(){
    $scope.loading = false;
    $state.go($state.current, {}, {reload: true});
  }

  function onUploadError(item, response, status, headers){
    $scope.loading = false;
    console.log(item, response, status, headers);
  }

  function onProgressItem(item, progress){
    $scope.loading = true;
  }

  // DELETE PROJECT FUNCTION - WILL DELETE PROJECT ACROSS ALL USER SHARED
  // $scope.deleteProject = function(projectID){
  //   $scope.loading = true;
  //   return Projects.remove(projectID).then(function(data){
  //     console.log(data);
  //     $scope.loading = false;
  //     init();
  //   });
  // };

  $scope.showCreateProjectForm = function(){
    $scope.showCreateProject = true;
    $scope.showOpenProject = false;
    $scope.showImportPostmanProject = false;
    $scope.showProjectCreateLink = false;
    $scope.showProjectListLink = true;
    $scope.showImportPostmanProjectLink = true;
  };

  $scope.showImportPostmanProjectForm = function(){
    $scope.showCreateProject = false;
    $scope.showOpenProject = false;
    $scope.showImportPostmanProjectLink = false;
    $scope.showImportPostmanProject = true;
    $scope.showProjectCreateLink = true;
    $scope.showProjectListLink = true;
  };
  $scope.showProjectsListForm = function (){
    init();
  };

  $scope.importFromPostman = function(){
    PostmanImport.save();
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
