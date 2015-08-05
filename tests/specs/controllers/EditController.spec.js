describe('Controller: EditController', function() {

  var $rootScope, $scope, $controller;
  beforeEach(module('app'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _Config_, _RequestStubs_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    Config = _Config_;
    RequestStubs = _RequestStubs_;
    $controller('EditorCtrl', {'$scope': $scope});
  }));

  describe('Valid URL', function(){
    it('response body is set');
    it('response headers are set');
    it('response status is set');
    it('response statusText is set');
    it('response errors are set');
  });

  describe('INVALID URL', function(){
    it('response body is set');
    it('response headers are set');
    it('response status is set');
    it('response statusText is set');
    it('response errors are set');
  });

  describe('url unreachable', function(){
    it('default unreachable message is shown');
    it('includes the cerficate issue');
    it('includes internet connection issue');
    it('response body is not set');
    it('response headers are not set');
    it('response status is not set');
    it('response statusText is not set');
    it('response errors are not set');
  });


  describe('uses one header', function(){
    it('uses one header');
  });

  describe('uses multiple headers', function(){
    it('uses multiple headers');
  });

  describe('uses body with a post', function(){
    it('uses body with a post');
  });

  describe('uses body with a put', function(){
    it('uses body with a put');
  });

  describe('ignores body with a get', function(){
    it('ignores body with a get');
  });

});
