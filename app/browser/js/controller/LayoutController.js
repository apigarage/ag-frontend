angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$q',
  '$state',
  'lodash',
  'Projects',
  function ($scope, $rootScope, $modal, $q, $state, _, Projects ){

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
    // Reset Current Proejct to undefined when switching between projects
    $rootScope.$broadcast('loadPerformRequest', {}, true, function(){
      $rootScope.currentProjectId = undefined;
      $state.go('projectcreateoropen');
    });

  };

  $scope.refreshProject = function(){
    Projects.loadProjectToRootScope($rootScope.currentProjectId);
  };

  $scope.renameProject = function(){
    return showProjectRenameModal();
  }

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

  $scope.openShareProjectModal = function(){
    var newModal = $modal({
      show: false,
      template: "html/prompt.html",
      animation: false,
      backdrop: true,
      title: "Share Project",
      content: JSON.stringify({
        // modal window properties
        'disableCloseButton': false,
        'promptMessage': false,
        'promptMessageText': 'Share Project to : ',
        'promptIsError': false,
        'hideModalOnSubmit': false,

        // submit button properties
        'showSubmitButton' : true,
        'disbledSubmitButton' : false,
        'submitButtonText' : 'Share',

        // discard button properties
        'showDiscardButton' : true,
        'disbleDiscardButton' : false,
        'discardButtonText' : 'Cancel',

        // input prompt properties
        'showInputPrompt' : false,
        'requiredInputPrompt' : false,
        'placeHolderInputText': '',
        'labelInputText': '',

        // input email prompt properties
        'showInputEmailPrompt' : true,
        'requiredInputEmailPrompt': true,
        'placeHolderInputEmailText': 'Email Address',
        'labelInputEmailText': 'Share Project to Email'
      })

    });
    newModal.$scope.success = $scope.shareProject;
    newModal.$scope.cancel = function(error){ return $q.resolve(); };
    newModal.$promise.then( newModal.show );
    return newModal;
  };

  $scope.shareProject = function(data){
    return Projects.shareProject($rootScope.currentProject.id, data)
      .then(function(response){
        if (_.isEqual(response.status, 200)){
          return "Shared Project: " + data.email;
        }else{
          return "Failed to Share Project: ";
        }
      });
  };

  init();

}]);
