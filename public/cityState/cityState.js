angular.module('setupApp').controller('cityStateController', function($scope, $location){
	$scope.toCustomerId = function(){
		localStorage.city = $scope.city;
		localStorage.state = $scope.state;
		$location.path('/customerId');
	};
})