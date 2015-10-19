angular.module('AGScrollHelpers')

// Automatically scroll the element to the bottom of it's height when the specified binding is updated.
// Useful for chat apps when new messages appear at the bottom.
// http://stackoverflow.com/questions/26343832/scroll-to-bottom-in-chat-box-in-angularjs
.directive('ngAutoScrollBottom', ['$timeout', function ($timeout) {
  return {
    scope: {
      ngAutoScrollBottom: "="
    },
    link: function ($scope, $element) {
      $scope.$watchCollection('ngAutoScrollBottom', function (newValue) {
        if (newValue) {
          $timeout(function(){
            $element.scrollTop($element[0].scrollHeight);
          }, 0);
        }
      });
    }
  }
}]);

