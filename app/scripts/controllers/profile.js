'use strict';

app.controller('ProfileCtrl', ['User', '$scope', '$state', "$stateParams", function(User, $scope, $state, $stateParams) {
	var username = $stateParams.username;

	$scope.follow = function() {
		console.log("attempt follow")
		User.followUser($scope.user_profile.instance._id).then(function(followed) {
			console.log("You are now following " + username);
		}, function(followed) {
			console.log(followed)
		})
	}

	var getSubmitted = function(profile) {
		var posts = new Stamplay.Cobject('post').Collection;
		posts.equalTo("owner", profile.instance._id).populateOwner().fetch().then(function() {
			$scope.submitted = posts.instance;
			$scope.$apply();
		})
	}

	var getUpvoted = function(profile) {
		User.getUpvoted(profile).then(function(upvoted) {
			upvoted = upvoted.data;
			upvoted.forEach( function(item, idx, arr) {
				var user = new Stamplay.User().Model;
				user.fetch(item.owner).then(function() {
					item.owner = user.instance;
					if(idx === arr.length - 1) {
						$scope.upvoted = upvoted;
						$scope.$apply();
					}
				})
			})
		})
	}

	var getFollowedBy = function(profile) {
		var user = new Stamplay.User().Model;
		user.followedBy(profile.instance._id).then(function(following) {
			console.log("Following:", following);
		})
	}

	User.getUser(username).then(function(profile) {
		$scope.user_profile = profile;
		var names = profile.instance.displayName.split(" ");
		$scope.firstname = names[0];
		$scope.username = profile.instance.username;
		$scope.lastname = names.length > 1 ? names[names.length - 1] : "";
		getSubmitted(profile);
		getUpvoted(profile.instance._id);
	});

}])
