angular.module('setupApp').controller('customerIdLinkController', function($scope, $location) {
	$scope.toAccountsLogIn = function() {
		localStorage.customerId = $scope.customerId;
		$location.path('/accountsLogInLink');
	};
});