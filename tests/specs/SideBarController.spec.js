// 'use strict';

describe('Controller: SideBar', function() {

  var $rootScope, $scope, $controller;

  beforeEach(module('app'));

  beforeEach(inject(function(_$rootScope_, _$controller_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;

    $controller('SidebarCtrl', {'$scope': $scope});
  }));

  it('should make endpointGroups which contains an array of 8 elements', function() {
    expect($scope.endpointGroups.length).toEqual(8);
  });

  it('Async: should make endpointGroups which contains an array of 8 elements', function(done) {
    expect($scope.endpointGroups.length).toEqual(8);
    done();
  });
});
