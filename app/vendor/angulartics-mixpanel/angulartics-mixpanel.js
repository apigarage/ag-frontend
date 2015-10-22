(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name angulartics.mixpanel
 * Enables analytics support for Mixpanel (http://mixpanel.com)
 */
angular.module('angulartics.mixpanel', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetUsername(function (userId) {
      mixpanel.identify(userId);
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetAlias(function (userId) {
      mixpanel.alias(userId);
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetSuperPropertiesOnce(function (properties) {
      mixpanel.register_once(properties);
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetSuperProperties(function (properties) {
      mixpanel.register(properties);
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetUserPropertiesOnce(function (properties) {
      mixpanel.people.set_once(properties);
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetUserProperties(function (properties) {
      mixpanel.people.set(properties);
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerPageTrack(function (path) {
      mixpanel.track( "Page Viewed", { "page": path } );
    });
  });

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerEventTrack(function (action, properties) {
      mixpanel.track(action, properties);
    });
  });

  // APIGARAGE_CUSTOM_CODE START
  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerTimeEvent = function (event_name) {
      mixpanel.time_event(event_name);
    };
  });
  // APIGARAGE_CUSTOM_CODE ED

}]);

})(window, window.angular);
