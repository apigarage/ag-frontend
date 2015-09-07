angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$state',
  '$window',
  '$q',
  'lodash',
  'Projects',
  'Auth',
  function ($scope, $rootScope, $modal, $state, $window, $q, _, Projects, Auth){


  function init(){
    $scope.layout = {
      sidebarExpanded: false,
      historyMaximized: false
    };
    $scope.online = $window.navigator.onLine;
    $scope.setConnectionStatus($scope.online);
    if(!$rootScope.currentProjectId) $state.go('projectcreateoropen');
    return Projects.loadProjectToRootScope($rootScope.currentProjectId);
  }

  $window.addEventListener("online", function () {
      $scope.setConnectionStatus(true);
      $rootScope.$digest();
  }, true);

  $window.addEventListener("offline", function () {
      $scope.setConnectionStatus(false);
      $rootScope.$digest();
  }, true);

  $scope.setConnectionStatus = function (online){
      $scope.online = online;
      $scope.connectionStatus = "Offline";
      if($scope.online) $scope.connectionStatus = "Online";
  };

  $scope.refreshProject = function(){
    Projects.loadProjectToRootScope($rootScope.currentProjectId);
  };

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
