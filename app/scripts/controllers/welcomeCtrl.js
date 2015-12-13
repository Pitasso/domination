'use strict';

app.controller('WelcomeCtrl', ['$scope', '$http', '$rootScope', '$uibModalInstance', '$state', "$stamplay", "$analytics", function($scope, $http, $rootScope, $uibModalInstance, $state, $stamplay, $analytics) {

	$scope.currentStep = 1;

	$scope.finishProfile = function() {
		$scope.processing = true;
		var profile = {
			username : $rootScope.currentUser.instance.username,
			gamestyle : $rootScope.currentUser.instance.gamestyle,
			email : $rootScope.currentUser.instance.email
		}
		var user = new $stamplay.User().Model;
		user.currentUser().then(function() {
			user.set("username", profile.username);
			user.set("gamestyle", profile.gamestyle);
			user.set("profileImg", user.instance.profileImg.split("_normal").join(""))
			user.set("email", profile.email);
			user.save().then(function() {
				$scope.currentStep = 2;
				$scope.processing = false;
				$scope.$apply();
	            $analytics.eventTrack('Completed Account');
			})
		})
	}

	$scope.requestMembership = function() {
		$scope.processing = true;
		$http({
			method: "POST",
			url : "https://dota.joingamers.net/api/codeblock/v1/run/prefinery",
			data : { "email": $rootScope.currentUser.instance.email }
		}).then(function(data) {
			$rootScope.currentUser.set('prefinery_id', data.data.id);
			$rootScope.currentUser.save().then(function() {
				$uibModalInstance.close(true);
				$analytics.eventTrack('Requested Membership', {								  
					"From": "Welcome Screen"
				});
			})
		}, function(err) {
			console.error(err);
		})
	}

	$scope.close = function() {
		$uibModalInstance.close();
	}

	$analytics.eventTrack('Viewed Welcome Screen')
	
}])
