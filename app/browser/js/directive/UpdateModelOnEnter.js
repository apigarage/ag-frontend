angular.module('app').
// REFERNECE:
// https://toresenneseth.wordpress.com/2014/08/10/update-the-model-on-enter-key-pressed-with-angularjs/
directive("updateModelOnEnterKeyPressed", function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModelCtrl) {
      elem.bind("keyup",function(e) {
        if (e.keyCode === 13) {
          ngModelCtrl.$commitViewValue();
        }
      });
    }
  };
});
