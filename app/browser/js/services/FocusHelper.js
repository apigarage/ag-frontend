'use strict';

// ============================================================================
// FOCUS
// ============================================================================
angular.module('app')

// Imperatively set focus to an element!
// Source: http://stackoverflow.com/questions/25596399/set-element-focus-in-angular-way
.factory('$focus', ['$timeout', function ($timeout) {
  return function(id) {
    // $timeout makes sure that is invoked after any other event has been triggered.
    // e.g. click events that need to run before the focus or
    // inputs elements that are in a disabled state but are enabled when those events
    // are triggered.
    $timeout(function() {
      var element = document.getElementById(id);
      if(element)
      {
        if(element.select)
          element.select(); // Was .focus() but .select() is even better!
        else
          angular.element(element).find('input').select();
      }
    });
  };
}]);
