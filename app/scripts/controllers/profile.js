'use strict';

app.controller('ProfileCtrl', ['User', '$scope', "$rootScope", '$state', "$stateParams", function(User, $scope, $rootScope, $state, $stateParams) {
	var username = $stateParams.username;

	$scope.follow = function() {
		User.followUser($scope.user_profile.instance._id).then(function(followed) {
			$scope.followingUser = true;
			$scope.$apply();
		})
	}
	$scope.unfollow = function() {
		User.unfollowUser($scope.user_profile.instance._id).then(function(followed) {
			$scope.followingUser = false;
			$scope.$apply();
			getFollowedBy();
		})
	}

	var getSubmitted = function(userId) {
		var posts = new Stamplay.Cobject('post').Collection;
		posts.equalTo("owner", userId).populateOwner().fetch().then(function() {
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

	var getFollowedBy = function(userId) {
		var user = new Stamplay.User().Model;
		user.followedBy(userId).then(function(followedBy) {
			$scope.followedBy = followedBy.data;
			$scope.$apply();
			if(followedBy.data.length === 0) {
				$scope.followingUser = false;
			} else {
				isFollowing(followedBy.data);
			}
		})
	}

	var isFollowing = function(followedBy) {
		var current = $rootScope.currentUser.instance._id;
		for(var i = 0; i < $scope.followedBy.length; i += 1) {
			if($scope.followedBy[i]._id === current) {
				$scope.followingUser = true;
			} else if ($scope.user_profile.instance._id === current) {
				$scope.followUser = undefined;
			} else {
				$scope.followingUser = false;
			}
		}
		$scope.$apply();
	}

	var getFollowing = function(userId) {
		var user = new Stamplay.User().Model;
		user.following(userId).then(function(following) {
			$scope.following = following.data;
			$scope.$apply();
		})
	}

	User.getUser(username).then(function(profile) {
		$scope.user_profile = profile;
		var names = profile.instance.displayName.split(" ");
		var id = profile.instance._id;
		$scope.firstname = names[0];
		$scope.username = profile.instance.username;
		$scope.lastname = names.length > 1 ? names[names.length - 1] : "";
		getSubmitted(id);
		getUpvoted(id);
		getFollowedBy(id);
		getFollowing(id);

	});

}])
