angular.module('app').controller('ProjectShareCtrl', [
  '$scope',
  '$rootScope',
  '$q',
  'lodash',
  'ProjectsUser',
  function ($scope, $rootScope, $q, _, ProjectsUser){
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
            return getProjectUsers();
          }else if(_.isEqual(response.status, 404)){
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
