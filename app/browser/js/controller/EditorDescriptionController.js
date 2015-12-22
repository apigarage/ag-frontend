angular.module('app').controller('EditorDescriptionCtrl', [
  '$scope',
  'Editor',
  'Analytics',
  'Users',
  function (
    $scope,
    Editor,
    Analytics,
    Users){

      // Endpoint Description Start
      //$scope.endpointDescription = { isExpanded : false, isEditing : false, content: '' }
      $scope.expandEndpointDescription = function(){
        $scope.endpointDescription.isExpanded = !$scope.endpointDescription.isExpanded;
      }

      $scope.editEndointDescription = function(){
        $scope.endpointDescription.isEditing = !$scope.endpointDescription.isEditing;
        if($scope.endpointDescription.isEditing){
          $scope.endpointDescription.content = $scope.agParentEndpoint.description;
        }else{
          $scope.agParentEndpoint.description = $scope.endpointDescription.content;
        }
      }

      $scope.requestDescriptionChanged = function(){
        $scope.agParentEndpoint.description = $scope.endpointDescription.content;
        Editor.setEndpoint( $scope.agParentEndpoint );
        if(!$scope.agRequestChangeFlag){
          $scope.agRequestChangeFlag = true;
        }
      };

      $scope.doneEditingDescription = function(){
        $scope.endpointDescription.isEditing = !$scope.endpointDescription.isEditing;
        $scope.agParentEndpoint.description = $scope.endpointDescription.content;
        Analytics.eventTrack('Save Request Description', {'from': 'EditorCtrl'});
        return Editor.saveOrUpdate().then(function(){
          // Rest Endpoint Flags and Editor Controller button to be disabled
          Editor.resetRequestChangedFlag();
          $scope.agRequestChangeFlag = false;
        });
      }

      $scope.$watch('agParentEndpoint.uuid',function(){

        var description = $scope.agParentEndpoint.description;
        var validContent = true;
        if(description  === null
          || description  === undefined
          || description  === ''){
            validContent = false;
            description = '';
          }
        console.log('description', description);
        $scope.endpointDescription = { isExpanded : false,
          isEditing : false,
          content: description,
          isValidContent : validContent}
      });
      // Open in browser window
      // markedProvider.setRenderer({
      //   link: function(href, title, text) {
      //     var anchor = "<a ng-click=openExternal(" + href + ")" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
      //     console.log('anchor', anchor);
      //     return anchor;
      //   }
      // });
      //
      // $scope.openExternal = function(link){
      //   require('shell').openExternal(link);
      // };


      // $scope.$watch('endpointDescription.content',function(){
      //   $scope.agRequestChangeFlag = true;
      //   $scope.agParentEndpoint.description = $scope.endpointDescription.content;
      // });

  }]);
