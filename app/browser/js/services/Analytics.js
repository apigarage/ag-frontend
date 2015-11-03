'use strict';
/* Services */

angular.module('app')
  .factory('Analytics', [ '$injector', 'Config',
    function($injector, Config){

    var $analytics = $injector.get('$analytics');
    var ipc = $injector.get('ipc');
    var startSessionTime;
    var stopSessionTime;
    var sessionOver;

    ipc.on('stop-session',function(){
      stopSessionTimer();
      sessionOver = true;
    });

    ipc.on('start-session',function(){
      startSessionTimer();
    });


    function startSessionTimer(){
      if (Config.name == "production" || Config.name == "staging"){
        if(sessionOver === undefined || sessionOver){
          startSessionTime = Date.now();
          sessionOver = false;
        }
      }else{
        console.log('startTime', Date.now());
      }
    }

    function stopSessionTimer(){
      stopSessionTime = Date.now() - startSessionTime ;
      if (Config.name == "production" || Config.name == "staging"){
        $analytics.eventTrack("Session", {'$duration': stopSessionTime});
      }else{
        ipc.send('stop-session-timer');
        console.log('stopTime', Date.now());
      }
    }

    // identify user
    var setUserID = function(userID){
      if (Config.name == "production" || Config.name == "staging"){
        $analytics.setUsername(userID);
        $analytics.setUserProperties({ '$id' : userID });
      }else{
        console.log('setUserName', userID);
      }
    };

    // @pagePath: string
    var pageTrack = function(pagePath){
      if (Config.name == "production" || Config.name == "staging"){
        // log analytics
        $analytics.pageTrack(pagePath);
      }else{
        console.log('pageTrack', pagePath);
      }
    };

    // @action: string type click, hover, eventTrack, Log Out
    // @properties: object action properties
    var eventTrack = function(action, properties){

      if (Config.name == "production" || Config.name == "staging"){
        // log analytics
        $analytics.eventTrack(action, properties);
      }else{
        console.log('action', action);
        console.log('properties', properties);
      }
    };

    var startSession = function(){
      startSessionTimer();
    };

    var stopSession = function(){
      stopSessionTimer();
    };

    return{
      setUserID : setUserID,
      pageTrack : pageTrack,
      eventTrack : eventTrack,
      startSession : startSession,
      stopSession : stopSession
    };
  }]);
