(function(){

  'use strict';

  // Declare app level module which depends on filters, and services
  var app = angular.module('app', [
    'ui.router',
    'ui.ace',                     // ACE Text Editor
    'mgcrea.ngStrap',             // Angular Strap
    'ngAnimate',                  // Animations
    'angular-ladda',              // Loading disabled + spinner icon for buttons
    'puElasticInput',             // Input element grows as you type (grep codebase for pu-elastic-input)
    'AGContentEditable'           // Content Editable Directive
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$tooltipProvider', '$dropdownProvider',
  function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide,   $tooltipProvider,   $dropdownProvider) {

    angular.extend($tooltipProvider.defaults, {
      delay: {
        show: 300,
        hide: 0
      }
    });
    angular.extend($dropdownProvider.defaults, {
      animation: 'none'
    });

    $urlRouterProvider.when('', '/authentication');
    $urlRouterProvider.otherwise('/authentication');

    // Chinmay/Gamal - you'll obviously have to redo the route logic significantly
    // for authentication to work correctly. Have fun :)
    // Possible hints: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
    $stateProvider
    .state('authentication', {
      abstract: false,
      url: '/authentication',
      templateUrl: 'html/authentication.html'
    })
    .state('app', {
      abstract: false,
      url: '/app',
      templateUrl: 'html/app.html'
    });

  }]);

})();