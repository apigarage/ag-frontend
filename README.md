
API Garage
============
We will be the best platform for APIs.

Testing Strategies
==================
General CRUD
------------
It's generally a three step process.
1. Create a fixture
2. Create a stub
3. Create a test utilizing fixtures and stubs
For example checkout AuthenticationCtrl.spec.js and projects.fixtures.js

Controller On Load Assignments
------------------------------
Set the rootScope values before constructing the controllers.
For example, checkout LayoutController.spec.js

Known Errors
============
http (template) pages are not loaded inside the tests
-----------------------------------------------------
It happens because $httpBackend is blocking all the server calls. Including the
template calls. It can be resolved by adding code below at the beginning of
each tests.
```
  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });
```

Also, we will have to let all the http requests go through.
```
$httpBackend.when('GET',/.*html.*/).respond(200, '');
```
For example, checkout LayoutController.spec.js

Technical Stuff
===============

Code Style
----------

### Testing ###
* Spec File Names (CamelCase) (Authentication.Ctrl.spec.js)
  * Spec Describer Level (TBD)
  * Controller Name (TBD)
  * Function Name (TBD)
  * Scenarios (TBD)

### Common ###
* Helper File Names (CamelCase) (Auth.helper.js)
* Helper Object Names (CamelCase) (AuthHelper.js)

### Angular Frontend ###
* Service File Names (CamelCase) (Auth.Service.js)
* Service Names (CamelCase) (Auth)
* Controller File Names (CamelCase) (AuthC.tpl.js)
* Controller Names (CamelCase) (AuthCtrl)
* Template/HTML File Names (CamelCase) (Auth.tpl)
