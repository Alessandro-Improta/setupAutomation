angular.module('setupApp').controller('accountsLogInController', function($http, constants, $scope, $window){
	var appUrl = constants.appUrl;
	$scope.logIn = function (){
    	return $http({
    		method: 'PUT',
    		url: appUrl + '/logIn',
    		data: {
    			redirectUrl: appUrl + '/accountsActions'
    		}
    	})
    	.then(function(res){
    		$window.location.href = res.data.url;
    	});
	};
});