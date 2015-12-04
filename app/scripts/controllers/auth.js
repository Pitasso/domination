'use strict';

app.controller('AuthCtrl', ['Auth', '$scope', '$rootScope', '$uibModal', "$state", function(Auth, $scope, $rootScope, $uibModal, $state ) {

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
			console.log("Finished Setting Up Profile");
		})
	}

	$scope.login = function() {
		Auth.login();
	}
	$scope.logout = function() {
		Auth.logout();
	}
	$scope.search = function() {
		$state.go("Home", {search: $scope.post_query })
	}
}])
