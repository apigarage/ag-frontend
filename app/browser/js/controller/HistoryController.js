angular.module('app').controller('HistoryCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  '$filter',
  'History',
  'Analytics',
  function (_, $scope, $rootScope, $filter, History, Analytics){
  $scope.recentRequest = {};
  $scope.historyTimeStamps = [];
  $scope.lastRequest = {};

  init();

  function init(){
    $scope.recentRequests = History.getHistory();
    $scope.historyTimeStamps = History.getHistoryTimeStamps();
    $scope.historyRequests = [];
    for (var i = 0; i < $scope.historyTimeStamps.length; i++) {
      $scope.historyRequests[$scope.historyTimeStamps[i]] = "";
      $scope.historyRequests[$scope.historyTimeStamps[i]] =
      $filter('json')($scope.recentRequests[$scope.historyTimeStamps[i]]);
    }
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

  $scope.parseModel = function(model){
    return $filter('json')( JSON.parse(model) );
  };

  $scope.responseBodyEditorOptionsParsed = {
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
      editor.setOptions({maxLines: 14});  // Auto adjust height!
      editor.$blockScrolling = Infinity; // Disable warning
      editor.setReadOnly(true);
    }
  };

}]);
