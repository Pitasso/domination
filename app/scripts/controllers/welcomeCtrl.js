'use strict';

app.controller('WelcomeCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$state', function($scope, $rootScope, $uibModalInstance, $state) {
	
    
    // $scope.steps = [
    //   { number: 1, name: 'First Step' },
    //   { number: 2, name: 'Second Step' },
    //   ];
    
    // $scope.currentStep = angular.copy($scope.steps[0]);    
    
    // $scope.nextStep = function() {
    //   // Perform current step actions and show next step:
    //   // E.g. save form data
      
    //   var nextNumber = $scope.currentStep.number;
    //   if ($scope.steps.length == nextNumber){
    //     $uibModalInstance.dismiss('cancel');
    //   }
    //   $scope.currentStep = angular.copy($scope.steps[nextNumber]);
    // };
    
    	
	$scope.finishProfile = function() {
		$uibModalInstance.close($scope.profile);
	}


}])
