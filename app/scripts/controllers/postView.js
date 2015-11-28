'use strict';

app.controller('PostViewCtrl', ['Post', '$scope', '$rootScope', '$state', '$stateParams', '$stamplay', "$http", function(Post, $scope, $rootScope, $state, $stateParams, $stamplay, $http) {
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
      if(!$scope.upvoters) $scope.upvoters = [];
      $scope.upvoters.push($rootScope.currentUser.instance);
			$scope.$apply();
		})
	}

    $scope.addComment = function(comment) {
        // $scope.processing_comment = true;
        Post.addComment(comment, $stateParams.slug, $scope.post.instance.owner.email).then(function(res) {
            res.instance.owner = $rootScope.currentUser.instance;
            incrementCommentCount();
            $scope.comments.push(res);
            $scope.comment_form = false;
        })
      }
  	$scope.addReply = function(comment, reply, idx) {
          var owner = comment.instance.owner;
          comment.comment(reply).then(function() {
            comment.instance.owner =  owner;
            $scope.comments[idx].instance.actions.comments = comment.instance.actions.comments;
            incrementCommentCount();
          })
          $scope.reply_open = false;
      }


      var incrementCommentCount = function() {
        var owner = $scope.post.instance.owner;
        var count = $scope.post.instance.comment_count ? $scope.post.instance.comment_count + 1 : 1;
        $scope.post.set("comment_count", count);
        $scope.post.set("owner", $scope.post.instance.owner._id);
        $scope.post.save().then(function() {
          $scope.post.instance.owner = owner;
          $scope.$apply();
        })
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
