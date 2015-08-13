angular.module('app').controller('HistoryCtrl', [
  '$scope',
  function ($scope){

  $scope.recentRequests = [
    {
      type: 'GET',
      url: 'https://www.facebook.com/'
    },
    {
      type: 'POST',
      url: 'https://www.facebook.com/some-dummy-url'
    },
    {
      type: 'GET',
      url: 'https://www.facebook.com/some-dummy-url'
    },
    {
      type: 'GET',
      url: 'https://www.facebook.com/another-really-long-url/with-extra-suffixes.php?and=params'
    },
    {
      type: 'DELETE',
      url: 'http://www.short-domain.com/'
    },
    {
      type: 'GET',
      url: 'https://www.facebook.com/another-really-long-url/with-extra-suffixes.php?and=params'
    },
    {
      type: 'DELETE',
      url: 'http://www.short-domain.com/'
    },
    {
      type: 'GET',
      url: 'http://bit.ly/musichacktoronto'
    }
  ];

}]);
