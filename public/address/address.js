angular.module('setupApp').controller('addressController', function($scope, $location){
	$scope.toAverageTicketPrice = function(){
		localStorage.addressOfTheater = $scope.addressOfTheater;
		$location.path('/averageTicketPrice');
	};
});