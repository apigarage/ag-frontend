(function(){
  'use strict';
  var _ = require('lodash');

  var requestUtility = {};

  // @input could be a string, array, or object
  // Example of an input string -
  // Example of an input Array -
  // Example of an input object -
  // @outputStyle - 'object', 'array'
  requestUtility.getHeaders = function(input, outputStyle){
    // First convert all the inputs into an array.
    // It will allow us to keep the index for later.
    if(!input){
      input = [];
    }

    if(typeof input === 'string'){
      if(input.length === 0) input = '[]';
      try{
        input = JSON.parse(input);
      } catch(e){
        console.log('Could not convert "' + input + '" into an object.');
        console.log(e);
        input = [];
      }
      // if it's an array, input is in the right state.
      // if it's an object, will be converted into an array in next step.
    }

    if(typeof input == 'object' && !Array.isArray(input)){
      var newInput = [];
      Object.keys(input).forEach(function(key){
        if(key) {
          newInput.push({'key': key, 'value': input[key]});
        }
      });
      input = newInput;
    }

    // Now, input is definitely an array (), convert into outputStyle.
    outputStyle = outputStyle.toLowerCase();
    switch (outputStyle) {
      case 'array':
        return input;
      case 'object':
        var output = {};
        input.forEach(function(element, index, array){
          if(element.key && element.value){
            output[element.key] = element.value;
          }
        });
        return output;
      case 'string':
        return JSON.stringify(input);
    }
  };

  requestUtility.buildRequest = function(options, environment){
    if(options.headers){
      options.headers = requestUtility.getHeaders(options.headers, 'object');
    }

    if(environment && environment.vars){
      options.url = replaceValue(options.url, environment);
      options.data = replaceValue(options.data, environment);

      if(options.headers){
        var headers = {};
        _.forEach(options.headers, function(value, key){
          key = replaceValue(key, environment);
          value = replaceValue(value, environment);
          headers[key] = value;
        });
        options.headers = headers;
      }

    }
    return options;
  };


  function replaceValue(str, environment){
    if(!str || !str.length || Array.isArray(str) ) return str;

    // may be something better? http://stackoverflow.com/a/15604206/802054
    _.forEach(environment.vars, function(variable){
      str = str.replace('{{' + variable.name + '}}', variable.value);
    });
    return str;
  }

  if(window){
    window.requestUtility = requestUtility;
  }

  return requestUtility;
})();
