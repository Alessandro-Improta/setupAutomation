angular.module('setupApp').controller('enterTemplateController', function($scope, $location){
	$scope.toTheater = function() {
		localStorage.templateId = $scope.templateId;
		$location.path('/theater');
	};
});