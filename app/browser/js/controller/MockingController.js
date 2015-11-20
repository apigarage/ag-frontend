angular.module('app').controller('MockingCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'Analytics',
  function (_, $scope, $rootScope, Analytics){


  function init(){
    $scope.getListStatusResponses();
    console.log('panels', $scope.panels);
  }

  // watch the panels change and reset the items within if not saved

  
  // create a function to track the panel state
  // watch that state in the controller below
  $scope.$watch('panels', function(data){
    console.log('data', data);
  });

  $scope.updateResponses = function(panel){
      console.log('panel', panel);
  };

  $scope.updateResponse = function(data){
    if(data===false){
      $scope.state = false;
      return;
    }
    console.log('updateResponse');
    $scope.state = true;
  };

  $scope.searchFilter = function(search){
    console.log('search', search);
    // for loop through panels length
    // find the title
    // recreate a new panel list
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

  init();

}]);
