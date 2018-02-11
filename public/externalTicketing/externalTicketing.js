angular.module('setupApp').controller('externalTicketingController', function($scope, $location){
	$scope.toAddress = function(){
		localStorage.externalTicketingUrl = $scope.externalTicketingUrl;
		$location.path('/address');
	};
});