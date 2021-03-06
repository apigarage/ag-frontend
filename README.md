API Garage
============

Description
===========
API Garage is a desktop application created in Electron. It's purpose is to generate live documentation for teams to collaborate on during the development process. 

Setup environment
=================
Inside the config folder create a config file based on the <environment> that will be building against filename has to be called env_<environment>.json. 

Create a env_development.json. with the contents below to get started with development. URL is required to be setup before one can 'npm start'

```
#!json

{
  "name": "development",
  "description": "Add here any environment specific stuff you like.",
  "url": "https://staging.apigarage.com/",
  "api": "api/",
  "client_id": "id_",
  "client_secret": "secret_44207Z6q1Lq5e6me0902",
  "database_name": "staging-apigarage",
  "access_token_key": "accessToken_staging",
  "manifest_file_url": "",
  "mixpanel_key": "",
  "update_check_interval": 60000,
  "syncTime": 10000
}

```
Install dependency libraries
============================
Required: Node
npm install
bower install
cd app 
bower install


Proposed Deployment Flow
========================

Building a release
------------------
There is an automated release flow that was created however, this flow is not streamlined. It is suggested that one use Deploying Full App Flow in order to create an executable for distribution and hard code the --version. ie. `gulp release --env=staging --version=0.2.1`

Deploying the Full App Flow:
----------------------------
Run `gulp release --env=[env] --bump=[bump] --version=[major.minor.patch]` where possible `env` is `development|staging|production` and possible `bump|version` is `major|minor|patch`. If `version` is `major.minor.patch`provided, it is used for building the installer (new version).

* Downloads the latest manifest file as mentioned in package.json
* Bumps up the version number based on the `bump`
* Creates the installer

Testing Strategies
==================

Running Tests
-------------
They are written in Jasmine and requires a env_test.json that looks like the item below. to run the test npm test


```
#!json

{
  "name": "test",
  "description": "Add here any environment specific stuff you like."
}

```

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