// @Anson - Some comments will help here.
angular.module('no-scroll', [
])

.controller('NoScrollCtrl', ['$scope', function ($scope) {

  // ...

}]);

angular.module('app').directive('noScroll', function () {
  return {
    restrict: 'A',
    transclude: false,
    replace: false,
    link: function (scope, element, attrs) {
      element.on('mousewheel', function(e){
        return false;
      });
    }
  };
});
