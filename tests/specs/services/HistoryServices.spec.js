describe('Services : History', function() {

  var $rootScope, $q;

  beforeEach(function(){
    localStorage.clear();
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    _ = $injector.get('lodash');
    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');

    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    Config = $injector.get('Config');
    History = $injector.get('History');

    // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  afterEach(function(){
    $rootScope.$apply();
  });

  // PROJECT CRUD TESTING
  describe('History Service Unit Test', function(){
    it('is able to get history empty item', function(){
      var editorHistory = History.getHistory();
      expect(editorHistory).not.toBeNull();
    });
    it('is able to set history item', function(){
      History.setHistoryItem({method: 'GET', url: 'www.google.com'});
      var editorHistoryTimeStamps = History.getHistoryTimeStamps();
      var editorHistory = History.getHistoryItem(_.last(editorHistoryTimeStamps));
      expect(editorHistory.method).toBe('GET');
      expect(editorHistory.url).toBe('www.google.com');
      History.clearHistory();
    });

    it('is able to replace previous call if the same', function(){
      History.setHistoryItem({method: 'GET', url: 'www.google.com'});
      History.setHistoryItem({method: 'GET', url: 'www.google.com'});
      var editorHistoryTimeStamps = History.getHistoryTimeStamps();
      var editorHistory = History.getHistoryItem(_.last(editorHistoryTimeStamps));
      expect(editorHistory.method).toBe('GET');
      expect(editorHistory.url).toBe('www.google.com');
      History.clearHistory();
    });

    it('is able to replace previous call if not the same', function(){
      History.setHistoryItem({method: 'GET', url: 'www.google.com'});
      History.setHistoryItem({method: 'GET', url: 'www.google.com1'});
      var editorHistoryTimeStamps = History.getHistoryTimeStamps();
      var lastItem  = _.last(editorHistoryTimeStamps);
      var firstItem = _.first(editorHistoryTimeStamps);
      var editorHistoryLast = History.getHistoryItem(lastItem);
      var editorHistoryFirst = History.getHistoryItem(firstItem);
      var historyItems = History.getHistory();
      expect(editorHistoryLast.method).toBe(historyItems[lastItem].method);
      expect(editorHistoryLast.url).toBe(historyItems[lastItem].url);
      expect(editorHistoryFirst.method).toBe(historyItems[firstItem].method);
      expect(editorHistoryFirst.url).toBe(historyItems[firstItem].url);
      History.clearHistory();
    });

    xit('is able to trim after 50 calls', function(){
      var arr = [];
      for(i = 0; i < 51; i++){ arr.push(i); }
      arr.forEach(function(n){
        $timeout(function(){
          var url = 'www.google.com' + n;
          if(n===1)
            History.setHistoryItem({method: 'GET', url: url, expected: 'testvalue'});
          History.setHistoryItem({method: 'GET', url: url});
        }, 1);
        $timeout.flush();
      });
      var editorHistoryTimeStamps = History.getHistoryTimeStamps();
      var editorHistory = History.getHistoryItem(_.last(editorHistoryTimeStamps));
      expect(editorHistory.expected).toBe('testvalue');
      History.clearHistory();
    });

  });


  // // PROJECT MANAGEMENT
  // describe('When user has a project already', function(){
  //   describe('', function(){
  //
  //   });
  // });


});
