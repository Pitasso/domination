'use strict';

app.controller('MembershipCtrl', ['$scope','$http', '$rootScope', '$state', '$stateParams', '$stamplay', function($scope, $http, $rootScope, $state, $stateParams, $stamplay) {

  var delay = setTimeout(function() {
    $http.post("http://dota.domination.cc/api/codeblock/v1/run/prefinerydetails", { id : $rootScope.currentUser.instance.prefinery_id})
    .then(function(data) {
      console.log(data)
      $scope.share_link = data.data.share_link;
      $scope.clicks = data.data.share_clicks_count;
      $scope.signups = data.data.share_signups_count;
      $scope.processed = true;
    }, function(error) {
      console.log(err)
    })
  }, 1000)
}])

//
