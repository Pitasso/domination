'use strict';

app.controller('ProfileCtrl', ['User', '$scope', "$rootScope", '$state', "$stateParams", "$analytics", function(User, $scope, $rootScope, $state, $stateParams, $analytics) {
	var username = $stateParams.username;

	$scope.follow = function() {
		User.followUser($scope.user_profile.instance._id).then(function(followed) {
			$scope.followingUser = true;
			$scope.$apply();
			$analytics.eventTrack('Followed a User', {
				user: $scope.user_profile.instance.username
			});
			Materialize.toast("You are now following " + $scope.user_profile.instance.username + ".", 3000);
		})
	}

	$scope.unfollow = function() {
		User.unfollowUser($scope.user_profile.instance._id).then(function(followed) {
			$scope.followingUser = false;
			$scope.$apply();
			$analytics.eventTrack('Unfollowed a User', {
				user: $scope.user_profile.instance.username
			});
			Materialize.toast("You are no longer following " + $scope.user_profile.instance.username + ".", 3000);
		})
	}

	var getSubmitted = function(userId) {
		var posts = new Stamplay.Cobject('post').Collection;
		posts.equalTo("owner", userId).populateOwner().populate().fetch().then(function() {
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
			console.log(current, $scope.followedBy[i])
			if($scope.followedBy[i]._id === current) {
				$scope.followingUser = true;
				break;
			} else if ($scope.user_profile.instance._id === current) {
				$scope.followUser = undefined;
				break;
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
		$analytics.eventTrack('Viewed Page', {
        	Page: "Profile Page"
	  	});
	});

}])
