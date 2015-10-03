angular.module('app').controller('ProjectShareCtrl', [
  '$scope',
  '$rootScope',
  '$q',
  'lodash',
  'Projects',
  function ($scope, $rootScope, $q, _, Projects){
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
      shareProjectUsers();
    }

    function shareProjectUsers(){
      return Projects.shareProjectUsers($rootScope.currentProject.id).then(function(response){
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
      var data = {"permission_id": permission};
      console.log(data);
      return Projects.shareProjectUsersUpdate($rootScope.currentProject.id, userId, permission)
        .then(function(response){
          console.log(response);
        });
    };

    $scope.shareProject = function(formController){
      var data = { "email" : formController.email };
      return Projects.shareProject($rootScope.currentProject.id, data)
        .then(function(response){
          if (_.isEqual(response.status, 200)){
            return shareProjectUsers();
          }else{
            return "Failed to Share Project: ";
          }
        });
      };

      $scope.shareProjectRemoveUser = function(user){
        var data = { "email" : user.email };
        return Projects.shareProjectRemoveUser($rootScope.currentProject.id, user.id, data)
          .then(function(response){
            return shareProjectUsers();
          });
      };

      init();
  }]);
