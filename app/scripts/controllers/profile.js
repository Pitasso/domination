'use strict';

app.controller('ProfileCtrl', ['User', '$scope', '$state', "$stateParams", function(User, $scope, $state, $stateParams) {
	var username = $stateParams.username;
	User.getUser(username).then(function(profile) {
		$scope.user_profile = profile;
		var user = new Stamplay.User().Model;
		var posts = new Stamplay.Cobject('post').Collection;
		user.followedBy(profile.instance._id).then(function(following) {
			console.log("Following:", following);
			console.log("<-->");
		})
		posts.equalTo("owner", profile.instance._id).populateOwner().fetch().then(function() {
			console.log(posts);
			console.log("<-->");
			$scope.submitted = posts.instance;
		})

	});

	$scope.follow = function() {
		console.log("attempt follow")
		User.followUser($scope.user_profile.instance._id).then(function(followed) {
			console.log("You are now following " + username);
		}, function(followed) {
			console.log(followed)
	})


}


}])
