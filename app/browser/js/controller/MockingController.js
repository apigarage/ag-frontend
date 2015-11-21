angular.module('app').controller('MockingCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'Analytics',
  function (_, $scope, $rootScope, Analytics){

  $scope.panelsCopy = [];
  // Watches the change of the item and gets the Mocked Responses
  $scope.$watch('agParentEndpoint.uuid', function(){
    $scope.getListStatusResponses();
  });

  $scope.searchFilter = function(search){
    console.log('search', search);
    var panels = [];

    for (var i = 0; i < $scope.panelsCopy.length; i++)
    {
      if(isFound($scope.panelsCopy[i].status, search)){
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


  $scope.getListStatusResponses = function(){
    // Call to Mocking Service
    // $scope.mockedStatusResponses = Mocking.getAll(item-uuid);
    // return $scope.mockedStatusResponses;

    $scope.panels = [
      {
        "uuid": "uuid-1",
        "status": "200",
        "body": "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch."
      },
      {
        "uuid": "uuid-2",
        "status": "404",
        "body": "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."
      },
      {
        "uuid": "uuid-3",
        "status": "500",
        "body": "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade."
      }
    ];

    $scope.panelsCopy = $scope.panels;
  };

}]);
