angular.module('app').controller('MockingSettingsCtrl', [
  '$scope',
  '$rootScope',
  '$q',
  'lodash',
  'ProjectsUser',
  'Analytics',
  'ipc',
  function ($scope, $rootScope, $q, _, ProjectsUser, Analytics, ipc){
    $scope.port = 9090;

    $scope.startMockServer = function(){

      //Lets require/import the HTTP module
      // send port number
      console.log("port", $scope.port);
      console.log(ipc.sendSync('start-server', { 'port': $scope.port}));

    };

    $scope.stopMockServer = function(){

      //Lets require/import the HTTP module

      console.log(ipc.sendSync('stop-server', 'node'));


    };


    ipc.on('server-request', function(request) {
      console.log('Request', request);
      // prints out request
    });

    ipc.on('server-Response', function(response) {
      console.log('response', response);
      // prints out responses
    });

    ipc.on('start-server', function(port) {
      console.log('server-started', port);
    });

    ipc.on('stopped-server', function(port) {
      console.log('server-stopped', port);
    });



    $scope.projectShare = {};
    $scope.currentUserPrivilege = "1";

    function init(){
      $scope.privilegeSelect = "0";
      $scope.selectedIcons = [];
      $scope.icons = [
        {"value": "1","label":"<i class=\"fa fa-lock\"></i> Admin"},
        {"value": "0","label":"<i class=\"fa fa-user\"></i> User"}
        ];
      $scope.currentUserEmail = localStorage.getItem("currentUserEmail");
      getProjectUsers();
    }

    function getProjectUsers(){
      return ProjectsUser.getProjectUsers($rootScope.currentProject.id).then(function(response){
        $scope.projectShare.users = response.data;
        angular.forEach($scope.projectShare.users, function(value, key){
          if(value.email==$scope.currentUserEmail){
            $scope.currentUserPrivilege = value.permission_id;
            return;
          }
        });
      });
    }

    $scope.isDisabled = function(){
      return $scope.currentUserPrivilege == "0";
    };

    $scope.updatePermission = function(userId, permission){
      var data = { "permission_id" : permission };
      console.log(data);
      return ProjectsUser.updateProjectUserPermission($rootScope.currentProject.id, userId, data)
        .then(function(response){
        });
    };

    $scope.addProjectUser = function(formController){
      var data = { "email" : formController.email };
      return ProjectsUser.addProjectUser($rootScope.currentProject.id, data)
        .then(function(response){
          if (_.isEqual(response.status, 200)){
            //  times clicked on shared
            Analytics.eventTrack('Share Project',
              { 'from' : 'ProjectShareCtrl',
                'existingUser' : true
              }
            );
            return getProjectUsers();
          }else if(_.isEqual(response.status, 404)){
            //  times clicked on shared
            Analytics.eventTrack('Share Project',
              { 'from' : 'ProjectShareCtrl',
                'existingUser' : false
              }
            );
            $scope.invitedEmailAddress = formController.email;
            $scope.showInviteSent = true;
            formController.email = "";
          }
        });
      };

      $scope.shareProjectRemoveUser = function(user){
        var data = { "email" : user.email };
        return ProjectsUser.removeProjectUser($rootScope.currentProject.id, user.id, data)
          .then(function(response){
            return getProjectUsers();
          });
      };

      init();
  }]);
