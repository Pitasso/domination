'use strict';

app.controller('SubmitPostCtrl', ['Post', 'Thumbnail', '$scope', '$rootScope', '$uibModalInstance', '$state', function(Post, Thumbnail, $scope, $rootScope, $uibModalInstance, $state) {

	$scope.tabs = [];
  	$scope.tabs.post = { type : 'link' };

	$scope.newPost = function() {
		var details = $scope.tabs.post
		var slug = '';
		if(details.type === 'link') {
			slug = details.title.split(' ').join('-');
		} else {
			var team_1 = details.team_1.split(' ').join("-");
			var team_2 = details.team_2.split(' ').join("-");
			var title = details.title.split(' ').join("-");
			slug = team_1 + "-vs-" + team_2 + "-" + title;
		}
		slug = slug.toLowerCase();
		$scope.tabs.post.slug = slug;
		var values = $scope.tabs.post;
		// Thumbnail.getFromUrl(values.url).then(function(thumbnail) {
		// 	values.thumbnail = thumbnail;
			Post.newPost(values).then(function(post) {
				Materialize.toast('Your post has been submitted.', 3000)
				$uibModalInstance.close(post);
			});
		// }, function(err) {
		// 	alert(err.message);
		// });
	}

}])
