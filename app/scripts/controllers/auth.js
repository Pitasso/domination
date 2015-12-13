'use strict';

app.controller('AuthCtrl', ['Auth', '$scope', '$rootScope', '$uibModal', "$state", "$analytics", function(Auth, $scope, $rootScope, $uibModal, $state, $analytics) {

	$scope.userLogin = function() {
		var loginModal = $uibModal.open({
			templateUrl: "app/views/login.html",
			controller: "AuthCtrl",
			windowClass: "fullscreen",
			animation: false,
			resolve: {
				items: function() {
					return $scope.items;
				}
			}
		})
		$analytics.eventTrack('Viewed Login Screen');
	}

	$rootScope.welcome = function() {
		var welcomeModal = $uibModal.open({
			templateUrl: "app/views/partial/welcome.html",
			controller: "WelcomeCtrl",
			windowClass: "fullscreen",
			animation: false,
			resolve: {
				items: function() {
					return $scope.items;
				}
			}
		})
		welcomeModal.result.then(function(membership_requested) {
			if(membership_requested) {
				$state.go("Membership");
			}
			$analytics.eventTrack('Finished Setting Up Profile');
		})
	}
	$scope.login = function() {
		$analytics.eventTrack('Logged In');
		Auth.login();		
	}
	$scope.logout = function() {
		$analytics.eventTrack('Logged Out');
		Auth.logout();
	}
	$scope.search = function() {
		$state.go("Home", {search: $scope.post_query })
	}
}])
