angular.module('setupApp').controller('theaterController', function($scope, $location){
	$scope.toCityState = function(){
		localStorage.theater = $scope.theater;
		$location.path('/cityState');
	};
});