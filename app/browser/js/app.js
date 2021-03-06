(function(){

  'use strict';

  // Declare app level module which depends on filters, and services
  var app = angular.module('app', [
    'ui.router',
    'ui.ace',                     // ACE Text Editor
    'mgcrea.ngStrap',             // Angular Strap
    'ngSanitize',                 // Allow rendering of html characters
    'ngAnimate',                  // Animations
    'angular-ladda',              // Loading disabled + spinner icon for buttons
    'puElasticInput',             // Input element grows as you type (grep codebase for pu-elastic-input)
    'AGContentEditable',          // Content Editable Directive
    'AGEndpointActivity',         // Editor Activity flagged/resolved/comments
    'ngLodash',                   // Javascript Utility Library (very similar to underscore)
    'angularFileUpload',          // Angular file uploader
    'duScroll',                   // Smooth scrolling to targets
    'angulartics',                // Angular Analytics
    'angulartics.mixpanel',       // Angular Analytics Mixpanel plugin
    'angular-uri',                // Angular URI module
    'hc.marked'                   // Angular Markdown directive
  ]);

  app.config(['$stateProvider',
    '$urlRouterProvider',
    '$controllerProvider',
    '$compileProvider',
    '$filterProvider',
    '$provide',
    '$tooltipProvider',
    '$dropdownProvider',
    '$analyticsProvider',
    'markedProvider',
  function ($stateProvider,
    $urlRouterProvider,
    $controllerProvider,
    $compileProvider,
    $filterProvider,
    $provide,
    $tooltipProvider,
    $dropdownProvider,
    $analyticsProvider,
    markedProvider) {

    // Open in browser window
    markedProvider.setRenderer({
      link: function(href, title, text) {
        var anchor = "<a ng-click=openExternal(" + href + ")" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
        console.log('anchor', anchor);
        return anchor;
      }
    });



    // Analytics prevent virtual page tracking
    $analyticsProvider.virtualPageviews(false);

    var defaultView = '/authentication';

    var access_token_key = env.access_token_key; // getting env from the window
    if( localStorage.getItem(access_token_key) ){
      defaultView = '/projectcreateoropen';
    }

    angular.extend($tooltipProvider.defaults, {
      delay: {
        show: 300,
        hide: 0
      }
    });
    angular.extend($dropdownProvider.defaults, {
      animation: 'none'
    });

    $urlRouterProvider.when('', defaultView);
    $urlRouterProvider.otherwise(defaultView);

    $stateProvider
    .state('authentication', {
      abstract: false,
      url: '/authentication',
      templateUrl: 'html/authentication.html'
    })
    .state('forgotpassword', {
      abstract: false,
      url: '/forgotpassword',
      templateUrl: 'html/forgot-password.html'
    })
    .state('projectcreateoropen', {
      abstract: false,
      url: '/projectcreateoropen',
      templateUrl: 'html/project-create-or-open.html'
    })
    .state('app', {
      abstract: false,
      url: '/app',
      templateUrl: 'html/app.html'
    });
  }]);

})();
