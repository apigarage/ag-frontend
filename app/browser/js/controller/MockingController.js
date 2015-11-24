angular.module('app').controller('MockingCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'Analytics',
  'Mocking',
  function (_, $scope, $rootScope, Analytics, Mocking){

    $scope.panelsCopy = [];


    // Watches the change of the item and gets the Mocked Responses
    $scope.$watch('agParentEndpoint.uuid', function(){
      if($scope.agParentEndpoint.uuid === undefined) return;
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
  }
]);
