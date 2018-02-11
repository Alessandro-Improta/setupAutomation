angular.module('setupApp').controller('averageTicketPriceController', function($scope, $location){
	$scope.toAccountsLogIn = function(){
		localStorage.averageTicketPrice = $scope.averageTicketPrice;
		$location.path('/accountsLogIn');
	};
});