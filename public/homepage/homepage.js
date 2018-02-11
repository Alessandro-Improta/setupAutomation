angular.module('setupApp').controller('homepageController', function($scope, $location){
	$scope.toAbout = function(){
		localStorage.homepageUrl = $scope.homepageUrl;
		$location.path('/about');
	};
});