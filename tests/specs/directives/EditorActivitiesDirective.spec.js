// Reference https://docs.angularjs.org/guide/unit-testing

describe('Directive: Editor Activities', function() {
  var $compile,
      $rootScope,
      template;

  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });
  // html/editor-activity.html
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function($templateCache, _$compile_, _$rootScope_, $injector){
    //assign the template to the expected url called by the directive and put it in the cache
    //template = $templateCache.get('editor-activity.html');
    ///$templateCache.put('editor-activity.html',template);
    $httpBackend = $injector.get('$httpBackend');

    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
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
    var activitesElement = angular.element('<editor-activities' +
      'ag-parent-type="item"' +
      'ag-parent-update-flag="updateItemFlag(status)"' +
      'ag-parent-update-activities="updateActivities(actionItem)"' +
      'ag-parent-endpoint="endpoint"' +
      'ag-parent-activity-item="activityItem"' +
      'ng-show="endpoint.uuid && endpointNav.tab == \'Activity\'" />'
    );
    var element = $compile(activitesElement)($rootScope);
    // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();
    console.log('element',element);
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("endpoint");
  });
});
