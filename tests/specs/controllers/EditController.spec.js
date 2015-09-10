describe('Controller: EditController', function() {

  var $rootScope, $scope, $controller;
  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    Config = $injector.get('Config');
    Projects = $injector.get('Projects');
    ItemsFixtures = $injector.get('ItemsFixtures');
    CollectionsFixtures = $injector.get('CollectionsFixtures');
    ProjectsFixtures = $injector.get('ProjectsFixtures');
    RequestStubs = $injector.get('RequestStubs');
    RequestUtility = $injector.get('RequestUtility');
    UUID = $injector.get('UUID');

    $controller('EditorCtrl', {
      $scope: $scope,
      $rootScope: $rootScope
    });

    // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  afterEach(function(){
    $scope.$digest();
    $rootScope.$apply();
  });

  describe('performRequest() - Valid URL', function(){
    afterEach(function(){
      $httpBackend.flush();
    });
    describe('GET Valid URL', function(){
      it('response headers is set', function(){
        stub = RequestStubs.getWithResponseHeadersStub;
        HttpBackendBuilder.build(stub.request, stub.response);
        $scope.endpoint.method = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // headers are stored as an array. Mimicing that behaviour for acurate testing.
        $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
        $scope.performRequest().then(function(){
          expect($scope.response).not.toBeNull();
          expect($scope.response.status).toEqual(stub.response.status);
          expect($scope.response.data).toBe(stub.response.data);
          expect($scope.response.headers.getheaders).toBe(stub.response.headers.getheaders);
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });
    });

    describe('POST Valid URL', function(){
      describe('with request Data', function(){
        it('response data is set', function(){
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
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBe(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
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
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBeUndefined(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
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
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBe(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

        it('response headers is not set', function(){
          stub = RequestStubs.postWithDataWithNoHeadersDataStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.requestMethod = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          // TODO requestBody should be requestData
          $scope.endpoint.requestBody = stub.request.data;
          $scope.endpoint.requestHeaders = stub.request.headers;
          $scope.performRequest().then(function(){
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBe(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers);
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

      });

      describe('without request Data', function(){
        it('response data is set', function(){
          stub = RequestStubs.postWithoutDataWithResponseDataStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.requestMethod = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          // TODO requestBody should be requestData
          $scope.endpoint.requestBody = stub.request.data;
          $scope.endpoint.requestHeaders = stub.request.headers;
          $scope.performRequest().then(function(){
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBe(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

        it('response data is not set', function(){
          stub = RequestStubs.postWithoutDataWithoutResponseDataStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.requestMethod = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          // TODO requestBody should be requestData
          $scope.endpoint.requestBody = stub.request.data;
          $scope.endpoint.requestHeaders = stub.request.headers;
          $scope.performRequest().then(function(){
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBeUndefined(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });
        it('response headers is set', function(){
          stub = RequestStubs.postWithoutDataWithHeadersStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.requestMethod = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          // TODO requestBody should be requestData
          $scope.endpoint.requestBody = stub.request.data;
          $scope.endpoint.requestHeaders = stub.request.headers;
          $scope.performRequest().then(function(){
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBe(stub.response.data);
            expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });

        it('response headers is not set', function(){
          stub = RequestStubs.postWithoutDataWithoutHeadersStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.requestMethod = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          // TODO requestBody should be requestData
          $scope.endpoint.requestBody = stub.request.data;
          $scope.endpoint.requestHeaders = stub.request.headers;
          $scope.performRequest().then(function(){
            expect($scope.response).not.toBeNull();
            expect($scope.response.status).toEqual(stub.response.status);
            expect($scope.response.data).toBe(stub.response.data);
            // headersheaders().postresponse undefined if headers data is part
            // of a response it will return an empty Array Object
            expect($scope.response.headers.postresponse).toBeUndefined(stub.response.headers);
            expect($scope.response.statusText).toBe(stub.response.statusText);
          });
        });
      });
    });
  });
  describe('performRequest() - URL invalid and unreachable', function(){ // GET and POST
    afterEach(function(){
      $httpBackend.flush();
    });
    describe('GET', function(){
      it('response is set', function(){
        stub = RequestStubs.getWithInvalidURL;
        HttpBackendBuilder.build(stub.request, stub.response);
        $scope.endpoint.requestMethod = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // TODO requestBody should be requestData
        $scope.endpoint.requestBody = stub.request.data;
        $scope.endpoint.requestHeaders = stub.request.headers;
        $scope.performRequest().then(function(){
          expect($scope.response).not.toBeNull();
          expect($scope.response.status).toEqual(stub.response.status);
          expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });

      it('response is not set', function(){
        stub = RequestStubs.getWithInvalidURLNoResponse;
        HttpBackendBuilder.build(stub.request, stub.response);
        $scope.endpoint.requestMethod = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // TODO requestBody should be requestData
        $scope.endpoint.requestBody = stub.request.data;
        $scope.endpoint.requestHeaders = stub.request.headers;
        $scope.performRequest().then(function(){
          expect($scope.response).not.toBeNull();
          expect($scope.response.status).toEqual(200);
          expect($scope.response.data).toBe(stub.response.data);
          expect($scope.response.headers.postresponse).toBeUndefined(stub.response.headers);
          expect($scope.response.statusText).toBe('');
        });
      });
    });
    describe('POST', function(){
      it('response is set', function(){
        stub = RequestStubs.postWithInvalidURLStub;
        HttpBackendBuilder.build(stub.request, stub.response);
        $scope.endpoint.requestMethod = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // TODO requestBody should be requestData
        $scope.endpoint.requestBody = stub.request.data;
        $scope.endpoint.requestHeaders = stub.request.headers;
        $scope.performRequest().then(function(){
          expect($scope.response).not.toBeNull();
          expect($scope.response.status).toEqual(stub.response.status);
          expect($scope.response.headers.postresponse).toBe(stub.response.headers.postresponse);
          expect($scope.response.statusText).toBe(stub.response.statusText);
        });
      });

      it('response is not set', function(){
        stub = RequestStubs.postWithInvalidURLNoResponseStub;
        HttpBackendBuilder.build(stub.request, stub.response);
        $scope.endpoint.requestMethod = stub.request.method;
        $scope.endpoint.requestUrl = stub.request.url;
        // TODO requestBody should be requestData
        $scope.endpoint.requestBody = stub.request.data;
        $scope.endpoint.requestHeaders = stub.request.headers;
        $scope.performRequest().then(function(){
          expect($scope.response).not.toBeNull();
          expect($scope.response.status).toEqual(200);
          expect($scope.response.data).toBe(stub.response.data);
          expect($scope.response.headers.postresponse).toBeUndefined(stub.response.headers);
          expect($scope.response.statusText).toBe('');
        });
      });
    });
  });

  describe('setRequestMethod', function(){
    it('request method GET', function(){
      $scope.setRequestMethod("GET");
      expect($scope.endpoint.requestMethod).toBe("GET");
      // get hides requestBody div
    });
    it('request method POST', function(){
      $scope.setRequestMethod("POST");
      expect($scope.endpoint.requestMethod).toBe("POST");
    });
  });

  describe('addRequestHeader', function(){
    xit('requestHeaders', function(){
      expect($scope.addRequestHeader).toBeDefined();
    });
  });

  describe('setEnvironment', function(){
    xit('environment', function(){
      $scope.setEnvironment("test");
      expect($scope.endpoint.environment).toBe("test");
    });
  });

  describe('Manage Environments', function(){
    xit('manageEnvironments', function(){
      expect($scope.manageEnvironment).toBeUndefined();
    });
  });


  describe('setResponsePreviewType', function(){
    afterEach(function(){
      $httpBackend.flush();
    });
    it('raw', function(){
      stub = RequestStubs.setPreviewTypeRawStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.endpoint.method = stub.request.method;
      $scope.endpoint.requestUrl = stub.request.url;
      $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
      $scope.currentResponsePreviewTab = stub.previewType;
      $scope.performRequest().then(function(){
        expect($scope.response).not.toBeNull();
        expect($scope.response.status).toEqual(stub.response.status);
        expect($scope.response.data).toBe(stub.response.data);
        expect($scope.response.headers.getheaders).toBe(stub.response.headers.getheaders);
        expect($scope.response.statusText).toBe(stub.response.statusText);
      });
    });

    it('parsed valid JSON', function(){
      stub = RequestStubs.setPreviewTypeParsedStub;
      // stringify js object as json
      stub.response.data = JSON.stringify(stub.response.data);
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.endpoint.method = stub.request.method;
      $scope.endpoint.requestUrl = stub.request.url;
      $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
      $scope.currentResponsePreviewTab = stub.previewType;
      $scope.performRequest().then(function(){
        expect($scope.response).not.toBeNull();
        expect($scope.response.status).toEqual(stub.response.status);
        expect($scope.response.data.JSONStub).toBe(stub.response.data.JSONStub);
        expect($scope.response.headers.getheaders).toBe(stub.response.headers.getheaders);
        expect($scope.response.statusText).toBe(stub.response.statusText);
      });
    });

    it('parsed invalid JSON', function(){
      stub = RequestStubs.setPreviewTypeParsedStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.endpoint.method = stub.request.method;
      $scope.endpoint.requestUrl = stub.request.url;
      $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
      $scope.currentResponsePreviewTab = stub.previewType;
      $scope.performRequest().then(function(){
        expect($scope.response).not.toBeNull();
        expect($scope.response.status).toEqual(stub.response.status);
        expect($scope.response.data.JSONStub).toBe(stub.response.data.JSONStub);
        expect($scope.response.headers.getheaders).toBe(stub.response.headers.getheaders);
        expect($scope.response.statusText).toBe(stub.response.statusText);
      });
    });

    it('preview', function(){
      stub = RequestStubs.setPreviewTypePreviewStub;
      // Replace the data with html
      stub.response.data = '<p style="color:blue">an html\n' +
                           '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
                           'snippet</p>';
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.endpoint.method = stub.request.method;
      $scope.endpoint.requestUrl = stub.request.url;
      $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
      $scope.currentResponsePreviewTab = stub.previewType;
      $scope.performRequest().then(function(){
        expect($scope.response).not.toBeNull();
        expect($scope.response.status).toEqual(stub.response.status);
        expect($scope.response.data).toBe(stub.response.data);
        expect($scope.response.headers.getheaders).toBe(stub.response.headers.getheaders);
        expect($scope.response.statusText).toBe(stub.response.statusText);
      });
      expect($scope.currentResponsePreviewTab.title).toBe(stub.previewType.title);
    });

  });

  describe('manageEnvironment', function(){
    xit('manageEnvironments', function(){
      expect($scope.manageEnvironment).toBeUndefined();
    });
  });

  describe('able to receive broadcast ', function(){
    it('is able to perform request', function(){
      stub = RequestStubs.setPreviewTypeParsedStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $rootScope.$broadcast('loadPerformRequest',stub, false);
      expect($scope.endpoint).not.toBeNull();
      expect($scope.endpoint.status).toEqual(stub.request.status);
      expect($scope.endpoint.data).toBe(stub.request.data);
      expect($scope.endpoint.statusText).toBe(stub.request.statusText);
    });
    it('is able to load request', function(){
      stub = RequestStubs.setPreviewTypeParsedStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $rootScope.$broadcast('loadPerformRequest',stub);
      expect($scope.endpoint).not.toBeNull();
      expect($scope.endpoint.status).toEqual(stub.request.status);
      expect($scope.endpoint.data).toBe(stub.request.data);
      expect($scope.endpoint.statusText).toBe(stub.request.statusText);
    });
  });

  describe('getResponseCodeClass', function(){
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
  });

  describe('LoadRequestToScope', function(){

    // Invalid Object means Object with url property
    describe('When invalid object is being set', function(){
      it('does not load the request', function(){
        var url = $scope.endpoint.requestUrl;
        $rootScope.currentItem = {};
        $scope.$apply();
        expect($scope.endpoint.requestUrl).toEqual(url);
      });
    });

    // Valid Object means Object with url property
    describe('When valid request is being loaded', function(){
      beforeEach(function(){
        endpoint = {
          'name': 'request with post and data',
          'uuid': 'uuid-uuid-uuid-uuid-1',
          'url': 'https://abx.xyz',
          'method': 'POST',
          'headers': JSON.stringify([
            {'key1': 'value1'},
            {'key2': 'value2'}
          ]),
          'data': 'some data to be sent'
        };
      });

      it('loads request', function(){
        var url = $scope.endpoint.url;
        $rootScope.$broadcast('loadPerformRequest', endpoint);
        $scope.$apply();
        expect($scope.endpoint.requestUrl).toEqual(endpoint.url);
        expect($scope.response).toEqual(null);
      });

      describe('When the data is undefined', function(){
        it('sets the data to empty string', function(){
          endpoint.data = undefined;
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual("");
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is empty', function(){
        it('sets the data to empty string', function(){
          endpoint.data = "";
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual("");
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is valid, but request method is GET', function(){
        it('sets the data to empty string', function(){
          endpoint.data = "";
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual("");
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is an object', function(){
        it('sets the data to valid stringified value of the object', function(){
          endpoint.data = {"data":"is an object"};
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual(JSON.stringify(endpoint.data));
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is valid', function(){
        it('sets the data to valid value', function(){
          endpoint.data = "Some Data";
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual(endpoint.data);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are undefined', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = undefined;
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty string', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = "";
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty array stringified', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = "[]";
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty object', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = {};
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty object stringified', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = {};
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are filled object', function(){
        it('sets the headers to an array with two elements', function(){
          endpoint.headers = {key1: 'value1', key2: 'value2'};
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(2);
          expect($scope.endpoint.requestHeaders[0].key).toEqual('key1');
          expect($scope.endpoint.requestHeaders[1].key).toEqual('key2');
          expect($scope.endpoint.requestHeaders[0].value).toEqual('value1');
          expect($scope.endpoint.requestHeaders[1].value).toEqual('value2');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are filled object stringified', function(){
        it('sets the headers to an array with two elements', function(){
          endpoint.headers = JSON.stringify({key1: 'value1', key2: 'value2'});
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(2);
          expect($scope.endpoint.requestHeaders[0].key).toEqual('key1');
          expect($scope.endpoint.requestHeaders[1].key).toEqual('key2');
          expect($scope.endpoint.requestHeaders[0].value).toEqual('value1');
          expect($scope.endpoint.requestHeaders[1].value).toEqual('value2');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers is an array with one element', function(){
        it('sets the headers to an array with one element', function(){
          endpoint.headers = [{'key': 'key1', 'value': 'value1'}];
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(1);
          expect($scope.endpoint.requestHeaders[0].key).toEqual('key1');
          expect($scope.endpoint.requestHeaders[0].value).toEqual('value1');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers is an array with two elements', function(){
        it('sets the headers to an array with two elements', function(){
          endpoint.headers = [
            {'key': 'key1', 'value': 'value1'},
            {'key': 'key2', 'value': 'value2'}
          ];
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(2);
          expect($scope.endpoint.requestHeaders[0].key).toEqual('key1');
          expect($scope.endpoint.requestHeaders[1].key).toEqual('key2');
          expect($scope.endpoint.requestHeaders[0].value).toEqual('value1');
          expect($scope.endpoint.requestHeaders[1].value).toEqual('value2');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers is an array with one element stringified', function(){
        it('sets the headers to an array with one element', function(){
          endpoint.headers = JSON.stringify([{'key': 'key1', 'value': 'value1'}]);
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(1);
          expect($scope.endpoint.requestHeaders[0].key).toEqual('key1');
          expect($scope.endpoint.requestHeaders[0].value).toEqual('value1');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers is an array with two elements stringified', function(){
        it('sets the headers to an array with two elements', function(){
          endpoint.headers = JSON.stringify([
            {'key': 'key1', 'value': 'value1'},
            {'key': 'key2', 'value': 'value2'}
          ]);
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(2);
          expect($scope.endpoint.requestHeaders[0].key).toEqual('key1');
          expect($scope.endpoint.requestHeaders[1].key).toEqual('key2');
          expect($scope.endpoint.requestHeaders[0].value).toEqual('value1');
          expect($scope.endpoint.requestHeaders[1].value).toEqual('value2');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is undefined', function(){
        it('sets the method to GET', function(){
          endpoint.method = undefined;
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('GET');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is unknown', function(){
        it('sets the method to GET', function(){
          endpoint.method = 'GET-INVALID';
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('GET');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is GET', function(){
        it('sets the method to GET', function(){
          endpoint.method = undefined;
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('GET');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is anything other than GET (POST)', function(){
        it('sets the method to POST', function(){
          endpoint.method = 'POST';
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('POST');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the uuid is set to undefined', function(){
        it('sets the uuid to undefined', function(){
          endpoint.uuid = undefined;
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.uuid).toEqual(undefined);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the uuid is set to empty string', function(){
        it('sets the uuid to undefined', function(){
          endpoint.uuid = undefined;
          $rootScope.$broadcast('loadPerformRequest', endpoint);
          $scope.$apply();
          expect($scope.endpoint.uuid).toEqual(undefined);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When request is made', function(){
        it('is able to abort GET', function(){
          stub = RequestStubs.getWithResponseHeadersStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.method = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
          $scope.performRequest();
          $scope.requestPromise.abort();
          expect($scope.performRequestButton).toBe(true);
          expect($scope.cancelRequestButton).toBe(false);
        });

        it('is able to abort POST', function(){
          stub = RequestStubs.postWithDataWithResponseDataStub;
          HttpBackendBuilder.build(stub.request, stub.response);
          $scope.endpoint.requestMethod = stub.request.method;
          $scope.endpoint.requestUrl = stub.request.url;
          $scope.endpoint.requestBody = stub.request.data;
          $scope.endpoint.requestHeaders = stub.request.headers;
          $scope.endpoint.headers = RequestUtility.getHeaders($scope.endpoint.headers, 'Array');
          $scope.performRequest();
          $scope.requestPromise.abort();
          expect($scope.performRequestButton).toBe(true);
          expect($scope.cancelRequestButton).toBe(false);
        });
      });
    });
  });

  describe('openNewCategoryModal', function(){
    beforeEach(function(){
      modal = $scope.openNewCategoryModal();
    });
    it('will open new category modal', function(){
      expect(modal.$scope.success).toBe($scope.saveNewCategory);
      expect(modal.$scope.cancel).toBeDefined();
    });
  });

  describe('openDeleteItemModal', function(){
    var modalDeleteItem;
    beforeEach(function(){
      $rootScope.currentItem = { name: 'itemName'};
      modalDeleteItem = $scope.openDeleteItemModal();
    });
    it('will open new delete modal', function(){
      expect(modalDeleteItem.$scope.success).toBe($scope.deleteItem);
      expect(modalDeleteItem.$scope.cancel).toBeDefined();
    });
  });

  describe('deleteItemCollection', function(){
    beforeEach(function(){
      project = ProjectsFixtures.get('projectWithTwoCollectionNoItems');
      $rootScope.currentProject = project;

      createStub = ProjectsFixtures.getStub('retrieveProjectWithTwoCollectionNoItems');
      HttpBackendBuilder.build(createStub.request, createStub.response);
      Projects.loadProjectToRootScope(project.id);

      item = ItemsFixtures.get('item1');
      $rootScope.$broadcast('loadPerformRequest', item);

      createItemsStub = ItemsFixtures.getStub('deleteItemId');
      HttpBackendBuilder.build(createItemsStub.request, createItemsStub.response);
    });

    it('will delete item.collection_id on the server and locally.', function(){
      $rootScope.currentCollection = CollectionsFixtures.get('collectionWithTwoItems');
      $scope.deleteItem().then(function(){
        expect($scope.endpoint.uuid).toBeUndefined();
      });
      $httpBackend.flush();
    });

  });

  // Save New Collection (Collection and Category are the same things)
  describe('saveNewCategory', function(){
    beforeEach(function(){
      spyOn($scope, 'changeCollection').and.returnValue(true);
    });

    describe('When current item is not selected and current collection is empty)', function(){

      describe('When Project does not have any collections', function(){
        beforeEach(function(){
          p = ProjectsFixtures.get('project2');
          $rootScope.currentProject = p;
          c = CollectionsFixtures.get('newCollection');

          createStub = CollectionsFixtures.getStub('createNewCollection');
          HttpBackendBuilder.build(createStub.request, createStub.response);
        });

        it('will update item.collection_id on the server and locally.', function(){
          $scope.saveNewCategory({name: c.name}).then(function(){
            expect($rootScope.currentProject.collections[c.id]).toBeDefined();
          });
          $httpBackend.flush();
        });
      });

      describe('When project has old collections', function(){
        beforeEach(function(){
          p = ProjectsFixtures.get('projectEmpty');
          $rootScope.currentProject = p;
          c = CollectionsFixtures.get('newCollectionEmptyProject');

          createStub = CollectionsFixtures.getStub('createNewCollectionForEmptyProject');
          HttpBackendBuilder.build(createStub.request, createStub.response);
        });

        it('will update item.collection_id on the server and locally.', function(){
          $scope.saveNewCategory({name: c.name}).then(function(){
            expect($rootScope.currentProject.collections[c.id]).toBeDefined();
          });
          $httpBackend.flush();
        });
      });

    });

  });

  describe('saveCurrentRequest', function(){
    beforeEach(function(){
      p = ProjectsFixtures.get('projectWithTwoCollectionNoItems');
      pStub = ProjectsFixtures.getStub('retrieveProjectWithTwoCollectionNoItems');
      HttpBackendBuilder.build(pStub.request, pStub.response);
      Projects.loadProjectToRootScope(p.id);

      c = CollectionsFixtures.get('collectionWithOneItems');

      i = ItemsFixtures.get('itemWithFullDetails');

      $httpBackend.flush();
    });

    describe('When name is not provided', function(){
        xit('it will show the error message');
    });

    describe('When name is not provided', function(){
        xit('it will focus the name');
    });

    describe('When the request is newly created request', function(){

      beforeEach(function(){
        $rootScope.$broadcast('loadPerformRequest', i);
        $rootScope.currentCollection = c;
        $scope.$apply();
        delete $scope.endpoint.uuid;

        // SPY ON FOR UUID GENERATOR. Otherwise, payload will be different than expected
        spyOn(UUID, 'generate').and.returnValue(i.uuid);
      });

      describe('When all the details are provided', function(){

        afterEach(function(){
          $httpBackend.flush();
        });

        it('will create the item.', function(){
          iStub = ItemsFixtures.getStub('createItemWithFullDetails');
          HttpBackendBuilder.build(iStub.request, iStub.response);
          $scope.saveCurrentRequest().then(function(){
            expect($rootScope.currentProject.collections[c.id].items[i.uuid]).toBeDefined();
          });
        });

      });

      describe('When url is not provided', function(){
        xit('will create the item without url');
      });

      describe('When data is not provided', function(){
        xit('will create the item without data');
      });

      describe('When headers is not provided', function(){
        xit('will create the item without headers');
      });
    });

    describe('When request is being updated', function(){

      beforeEach(function(){
        $rootScope.$broadcast('loadPerformRequest', i);
        $rootScope.currentCollection = c;
        $scope.$apply();
      });

      describe('When name is upated', function(){

        beforeEach(function(){
          updatedName = $scope.endpoint.name += 'updated';
        });

        afterEach(function(){
          $httpBackend.flush();
        });

        it('will update the item.', function(){
          iStub = ItemsFixtures.getStub('createItemWithFullDetailsNameUpdated');
          HttpBackendBuilder.build(iStub.request, iStub.response);
          $scope.saveCurrentRequest().then(function(){
            expect($rootScope.currentProject.collections[c.id].items[i.uuid]).toBeDefined();
            expect($rootScope.currentProject.collections[c.id].items[i.uuid].name).toBe(updatedName);
            expect($scope.endpoint.name).toBe(updatedName);
          });
        });

      });

      describe('When headers is upated', function(){

        beforeEach(function(){
          updatedHeaders = $scope.endpoint.requestHeaders = [];
        });

        afterEach(function(){
          $httpBackend.flush();
        });

        it('will update the item.', function(){
          iStub = ItemsFixtures.getStub('createItemWithFullDetailsHeadersUpdated');
          HttpBackendBuilder.build(iStub.request, iStub.response);
          $scope.saveCurrentRequest().then(function(){
            expect($rootScope.currentProject.collections[c.id].items[i.uuid]).toBeDefined();
            expect($rootScope.currentProject.collections[c.id].items[i.uuid].headers).toEqual({});
            // ^^ Returned as an empty object from the server
            expect($scope.endpoint.requestHeaders).toEqual(updatedHeaders);
            // ^^ loadRequestToScope will convert into an empty array
          });
        });

      });
      describe('When url is updated', function(){
        xit('will update the url');
      });
      describe('When description is updated', function(){
        xit('will update the description');
      });
      describe('When method is updated', function(){
        xit('will update the method');
      });
      describe('When data is updated', function(){
        xit('will update the data');
      });
    });
  });

  describe('changeCollection', function(){
    describe('When current item is selected (current collection has to be selected)', function(){

      beforeEach(function(){
        p = ProjectsFixtures.get('projectWithTwoCollectionNoItems');
        pStub = ProjectsFixtures.getStub('retrieveProjectWithTwoCollectionNoItems');
        HttpBackendBuilder.build(pStub.request, pStub.response);
        Projects.loadProjectToRootScope(p.id);

        $httpBackend.flush();

        oldC = CollectionsFixtures.get('collectionWithTwoItems');
        $rootScope.currentCollection = oldC;
        newC = CollectionsFixtures.get('collectionWithOneItems');

        i = ItemsFixtures.get('item1');
        $scope.loadRequestToScope(i);

        updateStub = ItemsFixtures.getStub('updateCollectionIdTo2');
        HttpBackendBuilder.build(updateStub.request, updateStub.response);
      });

      afterEach(function(){
        $httpBackend.flush();
      });

      it('will update item.collection_id on the server and locally.', function(){
        $scope.changeCollection(newC).then(function(){
          expect(true).toBe(true);
          expect($rootScope.currentProject.collections[oldC.id].items[i.uuid]).not.toBeDefined();
          expect($rootScope.currentProject.collections[newC.id].items[i.uuid]).toBeDefined();
        });
      });
    });
  });

});
