angular.module('setupApp').controller('templateQuestionController', function($location, $scope){
	$scope.toEnterTemplate = function() {
		$location.path('/enterTemplate');
	};

	$scope.toTheater = function() {
		$location.path('/theater');
	};
});