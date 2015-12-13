app.controller('NewPostCtrl', ['$scope', '$rootScope', '$uibModal', "$stamplay", "$analytics", function($scope, $rootScope, $uibModal, $stamplay, $analytics) {
  $scope.newPost = function() {
    if($rootScope.currentUser.instance.givenRole.name === 'registered') {
      var loginModal = $uibModal.open({
        templateUrl: "app/views/partial/permission.html",
        windowClass: "fullscreen",
        animation: false,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      })
      $analytics.eventTrack('Viewed Permission Denied Screen', {
        message: "Submit post skill is not available"
      });
    } else {
      var postModal = $uibModal.open({
        templateUrl: "app/views/submit.html",
        controller : "SubmitPostCtrl",
        windowClass: "submit-window",
        resolve: {
          post: function () {
            return $scope.posts;
          }
        }
      })

      postModal.result.then(function(post) {
        var newpost = new $stamplay.Cobject("post").Collection;
        newpost.equalTo("_id", post.instance._id).populateOwner().fetch().then(function() {
          console.log(newpost.instance[0])
          $scope.postCollection.push(newpost.instance[0]);
          $scope.$apply();
        })
      })
    }
  }
}]);
