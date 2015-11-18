// 'use strict';
// THIS WILL BE TESTING MOCKING setPath and match in serverManager.js


xkdescribe('Common : MockingUtility', function() {

  describe('When tests are loaded', function(){

    beforeEach(function(){
      mockingFixtures = window.mockingFixtures;
      mockingUtility = require('../../../app/common/helpers/serverManager.js');
    });

    describe('When a list of endpoints are provided 2', function(){

      beforeEach(function(){
        endpoints = mockingFixtures.endpoints;
        mockingUtility.init(endpoints);
      });

      describe('When a request with NON-MATCHING path is passed', function(){

        beforeEach(function(){
          request = mockingFixtures.nonMatchingPath;
        });

        it('does not matche the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).toEqual(null);
        });
      });

      describe('When a request with MATCHING path is passed', function(){

        beforeEach(function(){
          request = mockingFixtures.matchingPath;
        });

        it('matches the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).not.toBe(null);
          // TODO - verify, if it matches the correct request
        });
      });

      describe('When a request with MATCHING path but UPPERCASE is passed', function(){

        beforeEach(function(){
          request = mockingFixtures.matchingPathWithDifferentCase;
        });

        it('matches the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).not.toBe(null);
          // TODO - verify, if it matches the correct request
        });
      });

      describe('When a request with MATCHING path with ONE variable is passed', function(){

        beforeEach(function(){
          request = mockingFixtures.matchingWithOneVariable;
        });

        it('matches the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).not.toBe(null);
          // TODO - verify, if it matches the correct request
          // TODO - verify, if variables are matched correctly
        });
      });

      describe('When a request with MATCHING path with TWO variable is passed', function(){

        beforeEach(function(){
          request = mockingFixtures.matchingWithOneVariable;
        });

        it('matches the request', function(){
          var result = mockingUtility.match(endpoints, request);
          expect(result).not.toBe(null);
          // TODO - verify, if it matches the correct request
          // TODO - verify, if variables are matched correctly
        });
      });

    });

  });

});
