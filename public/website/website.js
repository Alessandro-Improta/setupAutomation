angular.module('setupApp').controller('websiteController', function($scope, $location){
	$scope.toHomepage = function(){
		localStorage.website = $scope.website;
		$location.path('/homepage');
	};
});