angular.module('setupApp').controller('customerIdController', function($scope, $location) {
	$scope.toWebsite = function() {
		localStorage.customerId = $scope.customerId;
		$location.path('/website');
	};
});