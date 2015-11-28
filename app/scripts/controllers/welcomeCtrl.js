'use strict';

app.controller('WelcomeCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$state', "$stamplay", function($scope, $rootScope, $uibModalInstance, $state, $stamplay) {

	$scope.currentStep = 1;


	$scope.finishProfile = function() {
		$scope.processing = true;
		var profile = {
			username : $rootScope.currentUser.instance.username,
			email : $rootScope.currentUser.instance.email
		}
		var user = new $stamplay.User().Model;
		user.currentUser().then(function() {
			user.set("username", profile.username);
			user.set("email", profile.email);
			user.save().then(function() {
				$scope.currentStep = 2;
				$scope.$apply();
			})
		})

	}

 $scope.close = function() {
	 $uibModalInstance.close();
 }

}])
