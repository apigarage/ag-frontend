angular.module('app').controller('HistoryCtrl', [
  '$scope',
  function ($scope){

  $scope.recentRequests = [
    {
      time: '2015-08-15 12:15PM',
      type: 'GET',
      url: 'https://www.facebook.com/some-random-fake-endpoint/another-page?v-=123123laskdfj&afa3a23f23f#12312345235987235'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'POST',
      url: 'https://www.facebook.com/some-dummy-url'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'GET',
      url: 'https://www.facebook.com/some-dummy-url'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'GET',
      url: 'https://www.facebook.com/another-really-long-url/with-extra-suffixes.php?and=params'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'DELETE',
      url: 'http://www.short-domain.com/'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'GET',
      url: 'https://www.facebook.com/another-really-long-url/with-extra-suffixes.php?and=params'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'DELETE',
      url: 'http://www.short-domain.com/'
    },
    {
      time: '2015-08-15 12:15PM',
      type: 'GET',
      url: 'http://bit.ly/musichacktoronto'
    }
  ];

}]);
