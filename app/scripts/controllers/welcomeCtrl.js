'use strict';

app.controller('WelcomeCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$state', function($scope, $rootScope, $uibModalInstance, $state) {

		$scope.finishProfile = function() {
			$uibModalInstance.close($scope.profile);
		}

}])
