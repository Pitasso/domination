'use strict';

app.controller('PostViewCtrl', ['Post', '$scope', '$rootScope', '$state', '$stateParams', '$stamplay', function(Post, $scope, $rootScope, $state, $stateParams, $stamplay) {
    var vm = this;
	vm.time = new Date();


    if(!$stateParams.slug) $state.go("Home");
    Post.getPostDetails($stateParams.slug).then(function(res) {
        $scope.post = res.post;
        $scope.comments = res.comments.instance;
        getUpvoters(res.post.instance.actions.votes.users)
    })

	$scope.upvotePost = function(post) {
		post.upVote().then(function() {
			$scope.$apply();
		})
	}

    $scope.addComment = function(comment) {
        $scope.processing_comment = true;
        Post.addComment(comment, $stateParams.slug, $scope.post.instance.owner.email).then(function(res) {
            res.instance.owner = $rootScope.currentUser.instance;
            $scope.comments.push(res);
            $scope.comment_form = false;
            $scope.processing_comment = false;
            $scope.$apply();
        })
      }
  	$scope.addReply = function(comment, reply, idx) {
          comment.comment(reply).then(function() {
            $scope.comments[idx].instance.actions.comments = comment.instance.actions.comments;
            $scope.$apply();
          })
          $scope.reply_open = false;
      }

      var getUpvoters = function(upvoters) {
        var user = new Stamplay.User().Model;
        upvoters.forEach(function(item, idx, arr) {
          user.fetch(item).then(function() {
            upvoters[idx] = user.instance;
            if(idx === arr.length - 1) {
              $scope.upvoters = upvoters;
              $scope.$apply();
            }
          })
        })
      }


}])
