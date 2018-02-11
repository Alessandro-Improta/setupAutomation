angular.module('setupApp').controller('newOrLinkController', function($location, $scope) {
	$scope.link = function() {
		$location.path('/customerIdLink');
	};

	$scope.newAccount = function() {
		$location.path('/templateQuestion');
	};
});