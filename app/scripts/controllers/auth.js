'use strict';

app.controller('AuthCtrl', ['Auth', '$scope', '$rootScope', '$uibModal', "$state", function(Auth, $scope, $rootScope, $uibModal, $state ) {
	
	$scope.userLogin = function() {
		var loginModal = $uibModal.open({
			templateUrl: "app/views/login.html",
			controller: "AuthCtrl",
			windowClass: "login-window",
			animation: false,
			resolve: {
        		items: function() {
          			return $scope.items;
        }
      }
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