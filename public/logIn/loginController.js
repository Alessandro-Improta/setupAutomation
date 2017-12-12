angular.module('setupApp').controller('logIn', function($scope, $http, $location, $window, constants){

	var appUrl = constants.appUrl;
	var redirectUrl;
	$scope.boolean = false;

	(function(){
		return $http.get(appUrl + '/loggedIn')
					.then(function(res) {
						if (res.data.loggedIn && res.data.loggedInAgain) {
							$location.path('client');
						} else if (res.data.loggedIn) {
							$location.path('/main')
						}
					})
	})()

	$scope.firstLogIn = function (){
    	return $http.get(appUrl + '/firstLogIn')
    				.then(function(res){
    					redirectUrl = res.data.url;
    					$window.location.href = redirectUrl;
    				});
		}

});
