(function(){
  'use strict';

  window.mockingFixtures = {};

  window.mockingFixtures.endpoints = [
    {
      'uuid': 'uuid-0',
      'url': 'https://abx.xyz',
      'path': '/path/with/text/and/numbers/00',
      'method': 'GET',
    },
    {
      'uuid': 'uuid-1',
      'url': 'https://abx.xyz',
      'path': '/path/with/text/and/numbers/00',
      'method': 'POST',
    },
    {
      'uuid': 'uuid-2',
      'url': 'https://abx.xyz',
      'path': '/path/with/{{variable}}',
      'method': 'POST',
    },
    {
      'uuid': 'uuid-2-1',
      'url': 'https://abx.xyz',
      'path': '/path/with/{{variable}}/', // Mind the extra slash at the end
      'method': 'POST',
    },
    {
      'uuid': 'uuid-3',
      'url': 'https://abx.xyz',
      'path': '/path/with/{{variable}}/with/text/after',
      'method': 'POST',
    },
    {
      'uuid': 'uuid-4',
      'url': 'https://abx.xyz',
      'path': '/path/with/{{variable}}/{{twice}}',
      'method': 'POST',
    },
    {
      'uuid': 'uuid-5',
      'url': 'https://abx.xyz',
      'path': '/path/with/{{variable}}/{{twice}}/with/text/after',
      'method': 'POST',
    }
  ];

  window.mockingFixtures.nonMatchingPath = {
    'path': '/path/with/text/and/numbers/00/DONOTMATCH',
    'method': 'POST'
  };

  window.mockingFixtures.matchingPath = {
    'path': '/path/with/text/and/numbers/00',
    'method': 'POST'
  };

  window.mockingFixtures.matchingPathWithDifferentCase = {
    'path': '/path/WITH/text/and/NUMBERS/00',
    'method': 'POST'
  };

  window.mockingFixtures.matchingWithOneVariable = {
    'path': '/path/with/variableValue/',
    'method': 'POST'
  };

  window.mockingFixtures.matchingWithOneVariableWithDash = {
    'path': '/path/with/variable-value/',
    'method': 'POST'
  };


  // TODO - Two variables
  // TODO - Two variables with added text at the end

})();
