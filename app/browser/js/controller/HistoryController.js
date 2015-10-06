angular.module('app').controller('HistoryCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'History',
  function (_, $scope, $rootScope, History){
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
    // if it is an existing collection get the information
    if(historyItem.uuid){
      historyItem.requestChangedFlag = true;
      historyItem.existsInProject = true;
    }
    $rootScope.$broadcast('loadPerformRequest',historyItem, loadOnly);
  };

  $scope.$on('updateHistory', function(event, data) {
    $scope.recentRequests = History.getHistory();
    $scope.historyTimeStamps = History.getHistoryTimeStamps();
    getLastRequest();
  });

}]);
