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

});
