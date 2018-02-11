angular.module('setupApp').controller('buyTicketsController', function($scope, $location){
	$scope.toExternalTicketing = function(){
		localStorage.buyTicketsUrl = $scope.buyTicketsUrl;
		$location.path('/externalTicketing');
	};
});