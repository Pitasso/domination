'use strict';

app.controller('SettingsCtrl', ['User', '$scope', '$state', "$stateParams", function(User, $scope, $state, $stateParams) {
	
	var username = $stateParams.username;
	
	User.getUser(username).then(function(settings) {
		
	});

	// var updateUserSettings = function(userId) {
	// 	var user = new Stamplay.User().Model;
	// 	user.followedBy(userId).then(function(followedBy) {
	// 		$scope.followedBy = followedBy.data;
	// 		$scope.$apply();
	// 		if(followedBy.data.length === 0) {
	// 			$scope.followingUser = false;
	// 		} else {
	// 			isFollowing(followedBy.data);
	// 		}
	// 	})
	// }

}])
