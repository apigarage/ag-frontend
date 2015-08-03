(function(){
  'use strict';
  var _ = require('lodash');
  // @input could be a string, array, or object
  // Example of an input string -
  // Example of an input Array -
  // Example of an input object -

  // @outputStyle - 'string', 'object', 'array'
  module.exports.getHeader = function(input, outputStyle){
    // First convert all the inputs into an array.
    // It will allow us to keep the index for later.
    if(typeof input == 'string'){
      try{
        input = JSON.parse(input);
      } catch(e){
        console.log('Could not convert "' + input + '" into an object.');
        console.log(e);
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
    }

    // Now, input is definitely an array (), convert into outputStyle.
  };
})();
