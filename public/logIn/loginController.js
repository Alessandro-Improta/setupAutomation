angular.module('setupApp').controller('logIn', function($scope, $http, $location, $window, constants){

	var appUrl = constants.appUrl;
	var redirectUrl;
	$scope.boolean = false;

	(function(){
		if (localStorage.loggedIn && localStorage.loggedInAgain) {
			$location.path('client');
		} else if (localStorage.loggedIn) {
			$location.path('/main')
		}
	})()

	$scope.firstLogIn = function (){
    	return $http.get(appUrl + '/firstLogIn')
    				.then(function(res){
    					localStorage.setItem("loggedIn", "true");
    					redirectUrl = res.data.url;
    					$window.location.href = redirectUrl;
    				});
		}

});
