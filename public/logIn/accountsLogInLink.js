angular.module('setupApp').controller('accountsLogInLinkController', function($http, constants, $scope, $window){
	var appUrl = constants.appUrl;
	$scope.logIn = function (){
    	return $http({
    		method: 'PUT',
    		url: appUrl + '/logIn',
    		data: {
    			redirectUrl: appUrl + '/accountsActionsLink/'
    		}
    	})
    	.then(function(res){
    		$window.location.href = res.data.url;
    	});
	};
});