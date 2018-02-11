angular.module('setupApp').controller('aboutController', function($scope, $location){
	$scope.toDirections = function(){
		localStorage.aboutUrl = $scope.aboutUrl;
		$location.path('/directions');
	};
});