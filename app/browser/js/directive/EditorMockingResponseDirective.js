angular.module('app').
directive("editorMockingResponse", [function() {
  return {
    restrict: 'E',
    templateUrl: 'html/editor-mocking-response.html',
    controller: 'MockingResponseCtrl',
    scope: {
      agMockingResponse  : "=",
      agMockingResponses : "=",
      agMockingParentEndpoint : "=",
      agMockingResponsesSearch : "&"
    }
  };
}]);
