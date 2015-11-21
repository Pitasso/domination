'use strict';

app.controller('PostViewCtrl', ['Post', '$scope', '$state', '$stateParams', '$stamplay', function(Post, $scope, $state, $stateParams, $stamplay) {

    var vm = this;
	vm.time = new Date();
	
    if(!$stateParams.id) $state.go("Home");
    Post.getPostDetails($stateParams.id).then(function(post) {
        $scope.post = post;
        $scope.comments = $scope.post.instance.actions.comments;
        if(post.instance.comment_id && post.instance.comment_id.instance){
            console.log("We have some comments here")
            $scope.post_comment = post.instance.comment_id;
        } else {
            console.log("No comments yet")
        }
    })

	$scope.upvotePost = function(post) {
		post.upVote().then(function() {
			$scope.$apply();
		})
	}

    $scope.addComment = function(comment, id) {
        $scope.processing_comment = true;
        Post.addComment(comment, id, $scope.post.instance.owner.email).then(function(res) {
            $scope.post_comment = res;
            $scope.comment_form = false;
            $scope.processing_comment = false;
            Materialize.toast("Comment has been added.", 2000)
        });
    }
	
	// $scope.addReply = function(post, reply) {
 //        var post_model = new $stamplay.Cobject("post").Model;
 //        post.comment(comment);
 //        post_model.fetch($scope.comment.instance._id).then(function(){
 //            $scope.comments = post_model.getComments();
 //            $scope.new_comment = "";
 //            $scope.$apply();            
 //        });
 //    }



}])