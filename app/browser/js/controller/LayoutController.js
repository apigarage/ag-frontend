angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$q',
  '$state',
  'lodash',
  'Projects',
  'ProjectsUser',
  'Analytics',
  function ($scope, $rootScope, $modal, $q, $state, _, Projects, ProjectsUser, Analytics){

  function init(){
    $scope.layout = {
      sidebarExpanded: false,
      historyMaximized: false
    };
    if( isNaN($rootScope.currentProjectId) ){
      $state.go('projectcreateoropen');
      return $q.resolve();
    }

    return Projects.loadProjectToRootScope($rootScope.currentProjectId);
  }

  $scope.switchProject = function(){
    // Reset Current Project to undefined when switching between projects
    Analytics.eventTrack('Switch Project', {'from': 'LayoutCtrl'});
    $rootScope.$broadcast('loadPerformRequest', {}, true, "LayoutCtrl", function(){
      $rootScope.currentProjectId = undefined;
      $rootScope.currentProject = undefined;
      $rootScope.currentEnvironment = undefined;
      $state.go('projectcreateoropen');
    });

  };

  $scope.refreshProject = function(){
    Projects.loadProjectToRootScope($rootScope.currentProjectId);
  };

  $scope.renameProject = function(){
    return showProjectRenameModal();
  };

  function showProjectRenameModal(){
    var deferred = $q.defer();

    var newModal = $modal({
      show: false,
      template: "html/prompt.html",
      animation: false,
      backdrop: true,
      title: "Rename Project",
      content: JSON.stringify({
        'hideModalOnSubmit': true,

        // submit button properties
        'showSubmitButton' : true,
        'disbledSubmitButton' : false,
        'submitButtonText' : 'Rename',

        // discard button properties
        'showDiscardButton' : true,
        'disbleDiscardButton' : false,
        'discardButtonText' : 'Cancel',

        // input prompt properties
        'showInputPrompt' : true,
        'requiredInputPrompt' : true,
        'placeHolderInputText': 'New Project Name',
        'labelInputText': 'Project Name',
        'inputPromptText': $rootScope.currentProject.name,

        // input email prompt properties
        'showInputEmailPrompt' : false,
        'requiredInputEmailPrompt': false,
      })

    });
    newModal.$scope.deferred = deferred;
    newModal.$scope.success = function(data){
      return Projects.updateProjectName(data.name);
    };
    newModal.$scope.cancel = function(error){ return $q.resolve(); };
    newModal.$promise.then( newModal.show );
    return $q.promise;
  }

  $scope.toggleHistory = function(){
    $scope.layout.historyMaximized = !$scope.layout.historyMaximized;
  };

  $scope.toggleSidebar = function(){
    $scope.layout.sidebarExpanded = !$scope.layout.sidebarExpanded;
  };

  $scope.openExternal = function(link){
    require('shell').openExternal(link);
  };

  $scope.openProjectSharedModal = function(){
    var projectShareModal = $modal({
      show: false,
      template: 'html/project-share-modal.html',
      title: 'Project Share',
      animation: false,
      backdrop: true
    });
    projectShareModal.$scope.projectShare  = $scope.projectShare;
    projectShareModal.$promise.then( projectShareModal.show );
    return projectShareModal;
  };

  $scope.openDeleteProjectModal = function(){
    $scope.currentUserEmail = localStorage.getItem("currentUserEmail");
    getProjectUsers().then(function(){
      var message = $scope.isDisabled() ? "You don't have permission to delete: " : "";
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        animation: false,
        backdrop: true,
        title: "Delete Project",
        content: JSON.stringify({
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': true,
          'promptMessageText': message + $rootScope.currentProject.name,
          'promptIsError': true,
          'hideModalOnSubmit': true,

          // submit button properties
          'showSubmitButton' : !$scope.isDisabled(),
          'disbledSubmitButton' : false,
          'submitButtonText' : 'Confirm',

          // discard button properties
          'showDiscardButton' : true,
          'disbleDiscardButton' : false,
          'discardButtonText' : 'Cancel',

          // input prompt properties
          'showInputPrompt' : false,
          'requiredInputPrompt' : false,

          // input email prompt properties
          'showInputEmailPrompt' : false,
          'requiredInputEmailPrompt': false,
        })

      });
      newModal.$scope.success = function(){
        return $scope.deleteProject($rootScope.currentProject)
        .then(function(response){
          // TODO: Error handling
          return response;
        });
      };
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    });

  };

  $scope.deleteProject = function(currentProject){
    return Projects.remove(currentProject)
      .then(function(response){
        // TODO: Error handling
        // check to see if  currentCollction is selected collection

        // time a collection is deleted
        Analytics.eventTrack('Delete Project', {'from': 'LayoutCtrl'});

        $scope.switchProject();
        return response;
      });
  };

  $scope.isDisabled = function(){
    return $scope.currentUserPrivilege == "0";
  };

  function getProjectUsers(){
    $scope.projectShare = {};
    return ProjectsUser.getProjectUsers($rootScope.currentProject.id).then(function(response){
      $scope.projectShare.users = response.data;
      angular.forEach($scope.projectShare.users, function(value, key){
        if(value.email==$scope.currentUserEmail){
          $scope.currentUserPrivilege = value.permission_id;
          return;
        }
      });
    });
  }

  $scope.openMockingServerSettingsModal = function(){
    console.log("openMocking");
    var mockingServerSettingsModal = $modal({
      show: false,
      template: 'html/mocking-settings-modal.html',
      title: 'Mocking Server Settings',
      animation: false,
      backdrop: true
    });
    mockingServerSettingsModal.$scope.projectMocking  = $scope.projectMocking;
    mockingServerSettingsModal.$promise.then( mockingServerSettingsModal.show );
    return mockingServerSettingsModal;
  };

  init();

}]);
