describe('Controller: EditController', function() {

  var $rootScope, $scope, $controller;
  beforeEach(module('app'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _HttpBackendBuilder_, _Config_, _RequestStubs_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    HttpBackendBuilder = _HttpBackendBuilder_;
    Config = _Config_;
    RequestStubs = _RequestStubs_;
    $controller('EditorCtrl', {
      $scope: $scope,
      $rootScope: $rootScope,
      $modalInstance: {}
    });
  }));

  afterEach(function(){
    $scope.$digest();
    $rootScope.$apply();
    $httpBackend.flush();
  });

  describe('GET Valid URL', function(){
    beforeEach(function() {
        simpleGetStub = RequestStubs.simpleGetStub;
    });
    it('response is set', function(){
      // Set user defined data and expected response
      HttpBackendBuilder.build(simpleGetStub.request, simpleGetStub.response);
      // Define the Request to match the request stub see HTTPBadkendBuilder
      $scope.endpoint.method = simpleGetStub.request.method;
      $scope.endpoint.requestUrl = simpleGetStub.request.url;
      // Perform the request to the URL
      $scope.performRequest().then(function(){
        // check if the response object is not null
        expect($scope.response).not.toBeNull();
        // verify
        // status
        expect($scope.response.status).toEqual(simpleGetStub.response.status);
        // data
        expect($scope.response.data).toBe(simpleGetStub.response.data);
        // headers
        expect($scope.response.headers.getheaders).toBe(simpleGetStub.response.headers.getheaders);
        // statusText
        expect($scope.response.statusText).toBe(simpleGetStub.response.statusText);
      });
    });
    it('response headers are set');
  });

  describe('POST Valid URL', function(){
    describe('with request Data', function(){
      it('response data is set', function(){
        // Set user defined data and expected response
        stub = RequestStubs.postWithDataWithResponseDataStub;
        HttpBackendBuilder.build(stub.request, stub.response);
        $scope.endpoint.requestMethod = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // TODO requestBody should be requestData
        $scope.endpoint.requestBody = stub.request.data;
        $scope.endpoint.requestHeaders = stub.request.headers;
        $scope.performRequest().then(function(){
          // check if the response object is not null
          expect($scope.response).not.toBeNull();
          // Verify
          // status
          expect($scope.response.status).toEqual(stub.response.status);
          // data
          expect($scope.response.data).toBe(stub.response.data);
          // headers
          // TODO this will be an object later on so the () is not necessary
          expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
          // statusText
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });

      it('response data is not set');

      it('response headers is set');
      // POSTStub without response headers

      it('response headers is not set');
      // POSTStub without r headers

    });
    // Also test

    describe('without Data', function(){
      it('response data is set');
      it('response data is not set');
      it('response headers is set');
      it('response headers is not set');
    });
  });

  describe('INVALID URL', function(){ // GET and POST
    it('response body is set');
    it('response headers are set');
    it('response status is set');
    it('response statusText is set');
    it('response errors are set');
  });

  describe('url unreachable', function(){ // GET and POST No connection
    it('default unreachable message is shown');
    it('includes the cerficate issue');
    it('includes internet connection issue');
    it('response body is not set');
    it('response headers are not set');
    it('response status is not set');
    it('response statusText is not set');
    it('response errors are not set');
  });

  describe('ignores body with a GET', function(){ // GET
    it('ignores body with a GET');
  });

});
