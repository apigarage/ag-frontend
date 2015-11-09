(function(){
  'use strict';

  window.mockingFixtures = {};

  window.mockingFixtures.endpoints = [
    {
      'uuid': 'uuid-1',
      'url': 'https://abx.xyz',
      'path': '/path/with/text/and/numbers/00',
      'method': 'POST',
    },
  ];

  window.mockingFixtures.matchingPath = {
    'url': 'https://abx.xyz',
    'path': '/path/with/text/and/numbers/00',
    'method': 'POST'
  };

  window.mockingFixtures.nonMatchingPath = {
    'url': 'https://abx.xyz',
    'path': '/path/with/text/and/numbers/00/DONOTMATCH',
    'method': 'POST'
  };

})();
