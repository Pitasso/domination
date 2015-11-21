'use strict';

app.controller('SubmitPostCtrl', ['Post', 'Thumbnail', '$scope', '$rootScope', '$uibModalInstance', '$state', function(Post, Thumbnail, $scope, $rootScope, $uibModalInstance, $state) {

	$scope.tabs = [];
  $scope.tabs.post = { type : 'link' };
	$scope.newPost = function() {
		var values = $scope.tabs.post;
		Thumbnail.getFromUrl(values.url).then(function(thumbnail) {
			values.thumbnail = thumbnail;
			Post.newPost(values).then(function(post) {
				$uibModalInstance.close(post);
			});
		}, function(err) {
			alert(err.message);
		});
	}

}])
