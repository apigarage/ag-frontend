describe('Controller: EditController', function() {

  var $rootScope, $scope, $controller;
  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    Config = $injector.get('Config');
    RequestStubs = $injector.get('RequestStubs');
    RequestUtility = $injector.get('RequestUtility');

    $controller('EditorCtrl', {
      $scope: $scope,
      $rootScope: $rootScope
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
  describe('URL invalid and unreachable', function(){ // GET and POST
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

  describe('set endpoint', function(){
    it('environment', function(){
      $scope.setEnvironment("test");
      expect($scope.endpoint.environment).toBe("test");
    });
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

  describe('add endpoint', function(){
    it('requestHeaders', function(){
      expect($scope.addRequestHeader).toBeDefined();
    });
  });

  describe('set preview type', function(){
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
  });

  describe('LoadRequestToScope', function(){
    beforeEach(function(){

    });

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
        $rootScope.currentItem = endpoint;
        $scope.$apply();
        expect($scope.endpoint.requestUrl).toEqual(endpoint.url);
        expect($scope.response).toEqual(null);
      });

      describe('When the data is undefined', function(){
        it('sets the data to empty string', function(){
          endpoint.data = undefined;
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual("");
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is empty', function(){
        it('sets the data to empty string', function(){
          endpoint.data = "";
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual("");
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is valid, but request method is GET', function(){
        it('sets the data to empty string', function(){
          endpoint.data = "";
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual("");
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is an object', function(){
        it('sets the data to valid stringified value of the object', function(){
          endpoint.data = {"data":"is an object"};
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual(JSON.stringify(endpoint.data));
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the data is valid', function(){
        it('sets the data to valid value', function(){
          endpoint.data = "Some Data";
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestBody).toEqual(endpoint.data);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are undefined', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = undefined;
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty string', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = "";
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty array stringified', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = "[]";
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty object', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = {};
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are empty object stringified', function(){
        it('sets the headers to an empty array', function(){
          endpoint.headers = {};
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect(Array.isArray($scope.endpoint.requestHeaders)).toEqual(true);
          expect($scope.endpoint.requestHeaders.length).toEqual(0);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the headers are filled object', function(){
        it('sets the headers to an array with two elements', function(){
          endpoint.headers = {key1: 'value1', key2: 'value2'};
          $rootScope.currentItem = endpoint;
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
          $rootScope.currentItem = endpoint;
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
          $rootScope.currentItem = endpoint;
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
          $rootScope.currentItem = endpoint;
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
          $rootScope.currentItem = endpoint;
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
          $rootScope.currentItem = endpoint;
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
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('GET');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is unknown', function(){
        it('sets the method to GET', function(){
          endpoint.method = 'GET-INVALID';
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('GET');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is GET', function(){
        it('sets the method to GET', function(){
          endpoint.method = undefined;
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('GET');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the method is anything other than GET (POST)', function(){
        it('sets the method to POST', function(){
          endpoint.method = 'POST';
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.requestMethod).toEqual('POST');
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the uuid is set to undefined', function(){
        it('sets the uuid to undefined', function(){
          endpoint.uuid = undefined;
          $rootScope.currentItem = endpoint;
          $scope.$apply();
          expect($scope.endpoint.uuid).toEqual(undefined);
          expect($scope.response).toEqual(null);
        });
      });

      describe('When the uuid is set to empty string', function(){
        it('sets the uuid to undefined', function(){
          endpoint.uuid = undefined;
          $rootScope.currentItem = endpoint;
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
          $scope.promise.abort();
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
          $scope.promise.abort();
          expect($scope.performRequestButton).toBe(true);
          expect($scope.cancelRequestButton).toBe(false);
        });
      });
    });
  });

});
