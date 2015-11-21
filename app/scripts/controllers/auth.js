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

	$rootScope.welcome = function() {
		var welcomeModal = $uibModal.open({
			templateUrl: "app/views/partial/welcome.html",
			controller: "WelcomeCtrl",
			windowClass: "login-window",
			animation: false,
			resolve: {
						items: function() {
								return $scope.items;
				}
			}
		})
		welcomeModal.result.then(function(profile) {
			var user = new Stamplay.User().Model;
			user.currentUser().then(function() {
				user.set("username", profile.username);
				user.set("email", profile.email);
				user.save().then(function() {
					console.log(user);
				})
			})
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
