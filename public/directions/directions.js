angular.module('setupApp').controller('directionsController', function($scope, $location){
	$scope.toBuyTickets = function(){
		localStorage.directionsUrl = $scope.directionsUrl;
		$location.path('buyTickets');
	};
});