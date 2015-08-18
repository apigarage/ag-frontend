angular.module('app')
// User Defined Client Calls

.factory('RequestStubs', ['HttpBackendBuilder', function($HttpBackendBuilder){
  var requestStubs = {
    // return a JSON Object
    getWithResponseHeadersStub : {
      request : {
        method : 'GET',
        url : 'www.google.com',
        // expected google get header
        headers : {
          "Content-Type":"application/json",
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response : {
        status : 200,
        data : "Test Data GET",
        statusText : 'OK',
        headers : { getheaders : 'getHeadersValue' }
      }
    },
    postWithDataWithResponseDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        data : 'Test Data POST request',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*",
          "Content-Type":"application/json;charset=utf-8"
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK'
      }
    },
    postWithDataWithoutResponseDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 200,
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK',
      }
    },
    postWithDataWithNoHeadersDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        data : 'Test Data POST request',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*",
          "Content-Type":"application/json;charset=utf-8"
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        statusText : 'OK'
      }
    },
    postWithoutDataWithResponseDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK'
      }
    },
    postWithoutDataWithoutResponseDataStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 200,
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK'
      }
    },
    postWithoutDataWithHeadersStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        headers : {
          'postresponse' : 'requestValue1'
        },
        statusText : 'OK'
      }
    },
    postWithoutDataWithoutHeadersStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 200,
        data : 'Test Data POST response',
        statusText : 'OK',
      }
    },
    getWithInvalidURL : {
      request : {
        method : 'GET',
        url : 'www.api-garage.com/invalid/url',
        // expected headers
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 0, // invalid URL
        data : '',
        statusText : 'Unreachable',
        headers : {
          'postresponse' : 'requestValue1'
        }
      }
    },
    getWithInvalidURLNoResponse : {
      request : {
        method : 'GET',
        url : 'www.api-garage.com/invalid/url',
        // expected headers
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
      }
    },
    postWithInvalidURLStub : {
      request : {
        method : 'POST',
        url : 'www.google.com',
        // expected google post header
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response:{
        status : 0, // invalid URL
        data : '',
        statusText : 'Unreachable',
        headers : {
          'postresponse' : 'requestValue1'
        }
      }
    },
    postWithInvalidURLNoResponseStub : {
      request : {
        method : 'POST',
        url : 'www.api-garage.com/invalid/url',
        data : 'Test Data POST request',
        // expected headers
        headers : {
          "language":"EN",
          "Accept":"application/json, text/plain, */*",
          "Content-Type":"application/json;charset=utf-8"
        }
      },
      response:{
      }
    },

    setPreviewTypeRawStub : {
      previewType : {
        title: 'Raw',
        url: 'html/editor-response-raw.html'
      },
      request : {
        method : 'GET',
        url : 'www.google.com',
        // expected google get header
        headers : {
          "Content-Type":"application/json",
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response : {
        status : 200,
        data : "Test Data GET",
        statusText : 'OK',
        headers : { getheaders : 'getHeadersValue' }
      }
    },


    setPreviewTypeParsedStub : {
      previewType : {
        title: 'Parsed',
        url: 'html/editor-response-parsed.html'
      },
      request : {
        method : 'GET',
        url : 'www.google.com',
        // expected google get header
        headers : {
          "Content-Type":"application/json",
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response : {
        status : 200,
        data : { "JSONStub" : "stub" },
        statusText : 'OK',
        headers : { getheaders : 'getHeadersValue' }
      }
    },

    setPreviewTypePreviewStub : {
      previewType : {
        title: 'Preview',
        url: 'html/editor-response-preview.html'
      },
      request : {
        method : 'GET',
        url : 'www.google.com',
        // expected google get header
        headers : {
          "Content-Type":"application/json",
          "language":"EN",
          "Accept":"application/json, text/plain, */*"
        }
      },
      response : {
        status : 200,
        data : { "JSONStub" : "stub" },
        statusText : 'OK',
        headers : { getheaders : 'getHeadersValue' }
      }
    },

  };
  return requestStubs;
}]);
