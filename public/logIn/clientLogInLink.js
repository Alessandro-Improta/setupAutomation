angular.module('setupApp').controller('clientLogInLinkController', function($http, constants, $scope, $window){
	var appUrl = constants.appUrl;
	$scope.logIn = function (){
    	return $http({
    		method: 'PUT',
    		url: appUrl + '/logIn',
    		data: {
    			redirectUrl: appUrl + '/clientActionsLink'
    		}
    	})
    	.then(function(res){
    		$window.location.href = res.data.url;
    	});
	};
});