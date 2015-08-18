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
    'ngLodash'                    // Javascript Utility Library (very similar to underscore)
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$tooltipProvider', '$dropdownProvider',
  function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide,   $tooltipProvider,   $dropdownProvider) {

    var defaultView = '/authentication';
    if( localStorage.getItem('accessToken') ){
      defaultView = '/app';
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

    // Chinmay/Gamal - you'll obviously have to redo the route logic significantly
    // for authentication to work correctly. Have fun :)
    // Possible hints: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
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
    .state('app', {
      abstract: false,
      url: '/app',
      templateUrl: 'html/app.html'
    });
  }]);

})();
