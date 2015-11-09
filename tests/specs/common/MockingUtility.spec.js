// 'use strict';

describe('Common : MockingUtility', function() {

  describe('When tests are loaded', function(){

    beforeEach(function(){
      mockingUtility = window.mockingUtility;
      mockingFixtures = window.mockingFixtures;
    });

    describe('When a lit of endpoints are provided', function(){

      beforeEach(function(){
        endpoints = mockingFixtures.endpoints;
      });

      describe('When a request with matching path is passed', function(){

        var request = mockingFixtures.matchingPath;
        it('matches the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).toEqual({uuid: "uuid-1"});
        });
      });

      describe('When a request with NON-matching path is passed', function(){

        var request = mockingFixtures.nonMatchingPath;
        it('does not matche the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).toEqual(false);
        });
      });

    });
    // Test URL to URL without matching (including protocol)
    // Test URL to URL with variable matching (including protocol)

    // Test Same URL Different without matching
  });

});
