'use strict';

app.controller('ProfileCtrl', ['$scope', '$state', "$stateParams", '$stamplay', '$http', '$q', function($scope, $state, $stateParams, $stamplay, $http, $q) {
	var displayName = $stateParams.displayName;
	$http.get("/api/user/v1/users?displayName=" + displayName)
		.then(function(data) {
			$scope.user_profile = data.data.data[0]
		}, function(err) {
			console.log(err);
		})
}])