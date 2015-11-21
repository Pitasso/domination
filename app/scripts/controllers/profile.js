'use strict';

app.controller('ProfileCtrl', ['$scope', '$state', "$stateParams", '$stamplay', '$http', '$q', function($scope, $state, $stateParams, $stamplay, $http, $q) {
	var username = $stateParams.username;
	$http.get("/api/user/v1/users?username=" + username)
		.then(function(data) {
			$scope.user_profile = data.data.data[0]
		}, function(err) {
			console.log(err);
		})
}])
