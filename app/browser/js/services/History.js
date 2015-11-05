'use strict';

/* Services */

angular.module('app')
  .factory('History', [
    'lodash',
    '$rootScope',
    '$window',
    'Config',
    function(_, $rootScope, $window, Config){

      var _historyTimeStamps = [];
      var localStorage = $window.localStorage;

      function isEqualSetHistoryPreviousCall(lastCallOptions, currentCallOptions){
        if(_.isEqual(lastCallOptions, currentCallOptions)){
           return true;
        }
        return false;
      }

      function trimHistory(){
        if (_.size(_historyTimeStamps) >= 50){ // TODO: configurable trim length
          localStorage.removeItem(_.last(_historyTimeStamps));
          _historyTimeStamps = _.dropRight(_historyTimeStamps);
        }
      }

      var getHistoryTimeStamps = function(){
        return _historyTimeStamps.reverse();
      };

      function verifyHistoryItem(currentCallOptions){
        if(!_.isEmpty(_historyTimeStamps)){
          var lastCallOptionsTimestamp = _.last(_historyTimeStamps);
          var lastCallOptions = getHistoryItem(lastCallOptionsTimestamp);
          if(isEqualSetHistoryPreviousCall(lastCallOptions, currentCallOptions)){
            localStorage.removeItem(lastCallOptionsTimestamp);
            _historyTimeStamps = _.dropRight(_historyTimeStamps);
          }
        }
      }

      var setHistoryItem = function(currentHistoryItem){
        delete currentHistoryItem.timeout;
        verifyHistoryItem(currentHistoryItem);
        trimHistory();
        var currentTime = _.now();
        _historyTimeStamps.push(currentTime);
        localStorage.setItem('historyTimeStamps', JSON.stringify(_historyTimeStamps));
        localStorage.setItem(currentTime, JSON.stringify(currentHistoryItem));
        var historyItem = getHistoryItem(currentTime);
      };

      var getHistoryItem = function(timeStamp){
        var options = {};
        options = JSON.parse(localStorage.getItem(timeStamp));
      return options;
      };

      var getHistory = function(){
        _historyTimeStamps = JSON.parse(localStorage.getItem("historyTimeStamps"));
        if(_.isNull(_historyTimeStamps)) _historyTimeStamps = [];
        // SORT the unsorted localstorage history timestamps entry before loading to the editor.
        _historyTimeStamps = _historyTimeStamps.sort();
        var editorHistory = _.reduce(_historyTimeStamps, function(historyItem, key) {
          historyItem[key] = JSON.parse(localStorage.getItem(key));
          historyItem[key].time = JSON.stringify(key);
          return historyItem;
        }, {});
        return editorHistory;
      };

      var clearHistory = function (){
        _(_historyTimeStamps).forEach(function(timeStamp) {
          localStorage.removeItem(timeStamp);
        }).value();
        localStorage.removeItem('historyTimeStamps');
      };

      return{
        setHistoryItem : setHistoryItem,
        getHistoryItem : getHistoryItem,
        getHistory : getHistory,
        getHistoryTimeStamps : getHistoryTimeStamps,
        clearHistory : clearHistory
      };

  }]);
