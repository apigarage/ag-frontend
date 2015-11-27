'use strict';
/* Services */

angular.module('app')
  .factory('Analytics', [ '$injector', 'Config', '$window',
    function($injector, Config, $window){

    var $analytics = $injector.get('$analytics');
    // TODO: replace this with Messaging Service
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

    $window.addEventListener("beforeunload", function(e){
      stopSessionTimer();
      sessionOver = true;
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
    var setUser = function(user){
      if (Config.name == "production" || Config.name == "staging"){
        $analytics.setUsername(user.id);
        $analytics.setUserProperties({ '$id' : user.id, '$email' : user.email, 'name': user.name });
      }else{
        console.log('setUserName', user.id);
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
      setUser : setUser,
      pageTrack : pageTrack,
      eventTrack : eventTrack,
      startSession : startSession,
      stopSession : stopSession
    };
  }]);
