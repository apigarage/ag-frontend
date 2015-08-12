describe('Controller: EditController', function() {

  var $rootScope, $scope, $controller;
  beforeEach(module('app'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _HttpBackendBuilder_, _Config_, _RequestStubs_, _RequestUtility_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    HttpBackendBuilder = _HttpBackendBuilder_;
    Config = _Config_;
    RequestStubs = _RequestStubs_;
    RequestUtility = _RequestUtility_;

    $controller('EditorCtrl', {
      $scope: $scope,
      $rootScope: $rootScope,
      $modalInstance: {}
    });
  }));

  afterEach(function(){
    $scope.$digest();
    $rootScope.$apply();
  });

  describe('URL valid', function(){
    afterEach(function(){
      $httpBackend.flush();
    });
    describe('GET Valid URL', function(){
      it('response headers is set', function(){
        // Set user defined data and expected response
        stub = RequestStubs.getWithResponseHeadersStub;
        HttpBackendBuilder.build(stub.request, stub.response);
        // Define the Request to match the request stub see HTTPBadkendBuilder
        $scope.endpoint.method = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // headers are stored as an array. Mimicing that behaviour for acurate testing.
        $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
        // Perform the request to the URL
        $scope.performRequest().then(function(){
          // check if the response object is not null
          expect($scope.response).not.toBeNull();
          // verify
          // status
          expect($scope.response.status).toEqual(stub.response.status);
          // data
          expect($scope.response.data).toBe(stub.response.data);
          // headers
          expect($scope.response.headers.getheaders).toBe(stub.response.headers.getheaders);
          // statusText
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });
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
          // headers are stored as an array. Mimicking that behaviour for acurate testing.
          $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
          $scope.performRequest().then(function(){
            // check if the response object is not null
            expect($scope.response).not.toBeNull();
            // Verify
            // status
            expect($scope.response.status).toEqual(stub.response.status);
            // data
            expect($scope.response.data).toBe(stub.response.data);
            // headers
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });
        it('response data is not set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithDataWithoutResponseDataStub;
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
            expect($scope.response.data).toBeUndefined(stub.response.data);
            // headers
            // TODO this will be an object later on so the () is not necessary
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

        it('response headers is set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithDataWithoutResponseDataStub;
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
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });
        // POSTStub without response headers

        it('response headers is not set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithDataWithNoHeadersDataStub;
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
            // headers - headers().postresponse undefined if headers data is part
            // of a response it will return an empty Array Object
            expect($scope.response.headers.postresponse).toBe(stub.response.headers);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

      });
      // Also test

      describe('without request Data', function(){
        it('response data is set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithoutDataWithResponseDataStub;
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
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

        it('response data is not set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithoutDataWithoutResponseDataStub;
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
            expect($scope.response.data).toBeUndefined(stub.response.data);
            // headers
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });
        it('response headers is set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithoutDataWithHeadersStub;
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
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

        it('response headers is not set', function(){
          // Set user defined data and expected response
          stub = RequestStubs.postWithoutDataWithoutHeadersStub;
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
            // headersheaders().postresponse undefined if headers data is part
            // of a response it will return an empty Array Object
            expect($scope.response.headers.postresponse).toBeUndefined(stub.response.headers);
            // statusText
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });
      });
    });
  });
  describe('URL invalid and unreachable', function(){ // GET and POST
    afterEach(function(){
      $httpBackend.flush();
    });
    describe('GET', function(){
      it('response is set', function(){
        // Set user defined data and expected response
        stub = RequestStubs.getWithInvalidURL;
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
          expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
          // statusText
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });

      it('response is not set', function(){
        // Set user defined data and expected response
        stub = RequestStubs.getWithInvalidURLNoResponse;
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
          expect($scope.response.status).toEqual(200);
          // data
          expect($scope.response.data).toBe(stub.response.data);
          // headers
          expect($scope.response.headers.postresponse).toBeUndefined(stub.response.headers);
          // statusText
          expect($scope.response.statusText).toBe('');
        });
      });
    });
    describe('POST', function(){
      it('response is set', function(){
        // Set user defined data and expected response
        stub = RequestStubs.postWithInvalidURLStub;
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
          expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
          // statusText
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });

      it('response is not set', function(){
        // Set user defined data and expected response
        stub = RequestStubs.postWithInvalidURLNoResponseStub;
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
          expect($scope.response.status).toEqual(200);
          // data
          expect($scope.response.data).toBe(stub.response.data);
          // headers
          expect($scope.response.headers.postresponse).toBeUndefined(stub.response.headers);
          // statusText
          expect($scope.response.statusText).toBe('');
        });
      });
    });
  });

  describe('set endpoint', function(){
    it('environment', function(){
      $scope.setEnvironment("test");
      expect($scope.endpoint.environment).toBe("test");
    });
    it('request method GET', function(){
      $scope.setRequestMethod("GET");
      expect($scope.endpoint.requestMethod).toBe("GET");
      // get hides requestBody div
      expect($scope.showRequestBody).toEqual(false);
    });
    it('request method POST', function(){
      $scope.setRequestMethod("POST");
      expect($scope.endpoint.requestMethod).toBe("POST");
    });
  });

  describe('add endpoint', function(){
    it('requestHeaders', function(){
      expect($scope.addRequestHeader).toBeDefined();
    });
  });

  describe('set preview type', function(){
    it('raw', function(){
      // $scope.snippet =
      //                '<p style="color:blue">an html\n' +
      //                '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
      //                'snippet</p>';
      var currentResponsePreviewTab = {
            title: 'Raw',
            url: 'html/editor-response-raw.html'
      };
      $scope.setResponsePreviewType(currentResponsePreviewTab);
    });
    xit('parsed', function(){
    });
    xit('preview', function(){
    });
  });

  describe('get endpoint', function(){
    it('manageEnvironments', function(){
      expect($scope.manageEnvironment).toBeUndefined();
    });
  });

  describe('get response code class', function(){
    it('undefined', function(){
      var result = $scope.getResponseCodeClass(undefined);
      expect('fa-spinner fa-pulse').toBe(result);
    });
    it('response empty', function(){
      var result = $scope.getResponseCodeClass(0);
      expect('fa-circle icon-danger').toBe(result);
    });
    it('server error response', function(){
      var result = $scope.getResponseCodeClass(500);
      expect('fa-circle icon-danger').toBe(result);
    });
    it('bad request', function(){
      var result = $scope.getResponseCodeClass(400);
      expect('fa-circle icon-warning').toBe(result);
    });
    it('successt', function(){
      var result = $scope.getResponseCodeClass(200);
      expect('fa-circle icon-success').toBe(result);
    });
  });  // Function getresponseCodeClass testing Code Status
});
