var os = require('os');

// This function is a copy of apigarage-electron-client/tasks/utils.js
// We made it inside the app folder so that this function can be used by the application.
module.exports.os = function () {
  switch (os.platform()) {
    case 'darwin':
      return 'osx';
    case 'linux':
      return 'linux';
    case 'win32':
      return 'windows';
  }
  return 'unsupported';
};
