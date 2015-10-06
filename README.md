
API Garage
============
We will be the best platform for APIs.

Proposed Deployment Flow
========================

Deploying the Update Flow:
--------------------------
Staging:
* Run `npm run release-staging --update --bump=major/minor/features` to build and view app-[v.v.v].asar file in your release folder.

* Run `npm run release-staging --deploy --bump=major/minor/features`
** to build and upload app-[v.v.v].asar file in Rackspace --> CloudFiles --> Staging --> Updates.
** to bump the package file and deploy it to staging npm file.

Production
* Run `npm run release-production --update --bump=major/minor/features` to build and view app-[v.v.v].asar file in your release folder.

* Run `npm run release-production --deploy --bump=major/minor/features`
** to build and upload app-[v.v.v].asar file in Rackspace --> CloudFiles --> production --> Updates.
** to bump the package file and deploy it to production npm file.

Deploying the Full App Flow:
----------------------------
TBD

Testing Strategies
==================
Some Guidelines (and Rules)
---------------------------
* Editor Controller MUST be fully tested. It's the core piece of the company, and cannot be broken.
* Feel free to not write unit test, if the feature is isolated, and does not have complex logic. For example: Item Rename. Item delete. If any team member has strong position in favor of writing tes

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

How to load project, collection and items in the current test
-------------------------------------------------------------
```
p = ProjectsFixtures.get('projectWithTwoCollectionNoItems');
pStub = ProjectsFixtures.getStub('retrieveProjectWithTwoCollectionNoItems');
HttpBackendBuilder.build(pStub.request, pStub.response);
Projects.loadProjectToRootScope(p.id);

c = CollectionsFixtures.get('collectionWithOneItems');
$rootScope.currentCollection = c;

i = ItemsFixtures.get('itemWithFullDetails');

$httpBackend.flush();
```

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
