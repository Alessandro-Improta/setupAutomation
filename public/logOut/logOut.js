angular.module('setupApp').controller('logOutController', function($location, $scope){
	$scope.googleLogOut = function() {
		window.open('https://accounts.google.com/logout', 'logOut', 'resizable');
		$location.path('/newOrLink');
	};
})