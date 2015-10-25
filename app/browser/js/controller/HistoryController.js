angular.module('app').controller('HistoryCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'History',
  'Analytics',
  function (_, $scope, $rootScope, History, Analytics){
  $scope.recentRequest = {};
  $scope.historyTimeStamps = [];
  $scope.lastRequest = {};

  init();

  function init(){
    $scope.recentRequests = History.getHistory();
    $scope.historyTimeStamps = History.getHistoryTimeStamps();
    getLastRequest();
  }

  function getLastRequest(){
    if(_.isEmpty($scope.historyTimeStamps)) return;
    $scope.lastRequest = History.getHistoryItem(_.first($scope.historyTimeStamps));
    $scope.lastRequest.time = _.first($scope.historyTimeStamps);
  }

  $scope.loadPerformRequest = function (historyTimeStamp, loadOnly){
    var historyItem = History.getHistoryItem(historyTimeStamp);

    // times history is re/loaded
    Analytics.eventTrack('History Load',
      { 'from' : 'HistoryCtrl',
        'performRequest' : !loadOnly
      }
    );
    
    $rootScope.$broadcast('loadPerformRequest',historyItem, loadOnly, "HistoryCtrl");
  };

  $scope.$on('updateHistory', function(event, data) {
    $scope.recentRequests = History.getHistory();
    $scope.historyTimeStamps = History.getHistoryTimeStamps();
    getLastRequest();
  });

}]);
