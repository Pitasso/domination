'use strict';

app.controller('PostViewCtrl', ['Post', '$scope', '$state', '$stateParams', '$stamplay', function(Post, $scope, $state, $stateParams, $stamplay) {

    var vm = this;
	vm.time = new Date();
	
    if(!$stateParams.id) $state.go("Home");
    Post.getPostDetails($stateParams.id).then(function(post) {
        $scope.post = post;
        $scope.comments = $scope.post.instance.actions.comments;
    })

	$scope.upvotePost = function(post) {
		post.upVote().then(function() {
			$scope.$apply();
		})
	}
	
	$scope.addComment = function(post, comment) {
        var post_model = new $stamplay.Cobject("post").Model;
        post.comment(comment);
        post_model.fetch($scope.post.instance._id).then(function(){
            $scope.comments = post_model.getComments();
            $scope.new_comment = "";
            $scope.$apply();            
        });
    }



}])