angular.module("AGContentEditable", [])

// http://gaboesquivel.com/blog/2014/in-place-editing-with-contenteditable-and-angularjs/
.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel){
      function read() {
        ngModel.$setViewValue(element.html());
      }
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };
      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});