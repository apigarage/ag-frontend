// Reference https://docs.angularjs.org/guide/unit-testing

describe('Directive: Editor Activities', function() {
  var $compile,
      $rootScope;
  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('test first directive', function() {
    // Compile a piece of HTML containing the directive
    // <editor-activities
    //   ag-parent-type="item"
    //   ag-parent-id="endpoint.uuid"
    //   ag-parent-flag="endpoint.flag"
    //   ag-parent-update-flag="updateItemFlag(status)"
    //   ag-parent-endpoint="endpoint"
    //   ng-show="endpoint.uuid && endpointNav.tab == 'Activity'" />

    // <li ag-editor-activity-item
    //     ag-editor-activity-type="'form'"
    //     ag-editor-activity-parentid="agParentId"
    //     ag-editor-activity-user="user.name"
    //     ag-editor-activity-flag="agParentFlag"
    //     ag-editor-activity-flag-status="updateFlag(status)"
    //     ag-editor-activity-endpoint="agParentEndpoint"
    //     >
    // </li>
    var element = $compile("<li ag-editor-activity-item>test</li>")($rootScope);
    // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();
    console.log('element',elment);
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("test");
  });
});
