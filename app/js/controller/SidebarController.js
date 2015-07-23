angular.module('app').controller('SidebarCtrl', [
  '$scope',
  function ($scope){

  $scope.endpointGroups = [
    {
      name: 'Albums',
      endpoints: [
        'Get an Album',
        'Get Several Albums',
        'Get an Album\'s Tracks'
      ]
    },
    {
      name: 'Artists',
      endpoints: [
        'Get an Artist',
        'Get Several Artists',
        'Get an Artist\'s Tracks',
        'Get an Artist\'s Top Tracks',
        'Get an Artist\'s Related Artists'
      ]
    },
    {
      name: 'Tracks',
      endpoints: [
        'Get a Track',
        'Get Several Tracks',
        'Search',
        'Search for an Item'
      ]
    },
    {
      name: 'Playlists',
      endpoints: [
        'Get a List of a User\'s Playlists',
        'Get a Playlist',
        'Get a Playlist\'s Tracks',
        'Create a Playlist',
        'Add Tracks to a Playlist',
        'Remove Tracks from a Playlist',
        'Reorder or replace a Playlist\'s Track Master',
        'Change a Playlist\'s Details'
      ]
    },
    {
      name: 'User Profiles',
      endpoints: [
        'Get a User\'s Profile',
        'Get Current User\'s Profile'
      ]
    },
    {
      name: 'User Library',
      endpoints: [
        'Get Current User\'s Saved Tracks',
        'Check Current User\'s Saved Tracks',
        'Save Tracks for Current User',
        'Remove Tracks for Current User'
      ]
    },
    {
      name: 'Browse',
      endpoints: [
        'Get a List of New Releases',
        'Get a List of Featured Playlists',
        'Get a List of Browse Categories',
        'Get a Single Browse Category',
        'Get a Category\'s playlists'
      ]
    },
    {
      name: 'Follow',
      endpoints: [
        'Check if Current User Follows Artists or Users',
        'Follow Artists or Users',
        'Unfollow Artists or Users',
        'Check if Users Follow a Playlist',
        'Unfollow a Playlist'
      ]
    }
  ];

}]);
