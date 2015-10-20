'use strict';
/* Services */

angular.module('app')
  .factory('Analytics', [ '$injector', 'Config',
    function($injector, Config){

    var $analytics = $injector.get('$analytics');

    // identify user
    var setUserID = function(userID){
      if (Config.name == "production"){
        $analytics.setUsername(userID);
        $analytics.setUserProperties({ '$id' : userID });
      }else{
        console.log('setUserName', userID);
      }
    };

    // @pagePath: string
    var pageTrack = function(pagePath){
      if (Config.name == "production"){
        // log analytics
        $analytics.pageTrack(pagePath);
      }else{
        console.log('pageTrack', pagePath);
      }
    };

    // @action: string type click, hover, eventTrack, Log Out
    // @properties: object action properties
    var eventTrack = function(action, properties){

      if (Config.name == "production"){
        // log analytics
        $analytics.eventTrack(action, properties);
      }else{
        console.log('action', action);
        console.log('properties', properties);
      }
    };

    return{
      setUserID : setUserID,
      pageTrack : pageTrack,
      eventTrack : eventTrack
    };
  }]);
