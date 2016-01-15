angular.module('app').controller('MockingCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  '$filter',
  'Analytics',
  'Mocking',
  function (_, $scope, $rootScope, $filter, Analytics, Mocking){

    $scope.panelsCopy = [];

    // Watches the change of the item and gets the Mocked Responses
    $scope.$watch('agParentEndpoint.uuid', function(){
      if($scope.agParentEndpoint === undefined || $scope.agParentEndpoint.uuid === undefined) return;
      $scope.getListStatusResponses($scope.agParentEndpoint);
    });

    $scope.searchFilter = function(search){

      var panels = [];

      for (var i = 0; i < $scope.panelsCopy.length; i++)
      {
        if($scope.panelsCopy[i].status !== undefined &&
          isFound($scope.panelsCopy[i].status.toString(), search.toString())){
          panels.push($scope.panelsCopy[i]);
        }
      }
      $scope.panels = panels;
    };

    function isFound(name, search){
      var result = -1;
      try {
        result = name.toLowerCase().search(search.toLowerCase());
      } catch (e) {
        result = 0;
      }
      return (result > -1);
    }

    $scope.getListStatusResponses = function(endpoint){
      return Mocking.getAll(endpoint.uuid).then(function(result){
        $scope.panels = result;
        $scope.panelsCopy = $scope.panels;
      });
    };

    // mocking logs
    $scope.mockingLogs = [];

    $scope.$on('stop-mocking-server', function(evt, data){
      $scope.agBottomBarMaximized = false;
      $scope.agLayoutMocking = false;
      $scope.agLayoutHistory = false;
    });

    $scope.$on('start-mocking-server', function(evt, data){
      $scope.mockingLogs = [];
    });

    $scope.$on('update-mocking-logs', function(event,data){
      // show logs if they aren't already open
      if(!$scope.agBottomBarMaximized) {
        $scope.agBottomBarMaximized = true;
        $scope.agLayoutMocking = true;
      }
      data.time = Date.now();
      $scope.mockingLogs.push(data);
    });

    $scope.loadPerformRequest = function (endpoint, loadOnly){

      // times history is re/loaded
      Analytics.eventTrack('Mocking Load',
        { 'from' : 'MockingCtrl',
          'performRequest' : !loadOnly
        }
      );

      $rootScope.$broadcast('loadPerformRequest',endpoint, loadOnly, "MockingCtrl");
    };

    $scope.mockingPort = Mocking.port;
    $scope.mockingCreate={isExpanded : false};
    $scope.expandMockingCreate = function(){
      console.log('expandMockingCreate');
      $scope.mockingCreate.isExpanded = !$scope.mockingCreate.isExpanded;
    }

    $scope.responseBodyMockingLogs = {
      useWrapMode : true,
      showGutter: true,
      theme: 'kuroir',
      mode: 'json',
      document: 'json',
      fontFamily: 'monospace',
      codeFolding: 'markbegin',
      onLoad: function(editor){
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(false);
        editor.setDisplayIndentGuides(false);
        editor.setOptions({maxLines: 10});  // Auto adjust height!
        editor.$blockScrolling = Infinity; // Disable warning
        editor.setReadOnly(true);
      }
    };

  }
]);
