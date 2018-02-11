angular.module('setupApp').controller('clientLogInController', function($http, constants, $scope, $window){
	var appUrl = constants.appUrl;
	$scope.logIn = function (){
    	return $http({
    		method: 'PUT',
    		url: appUrl + '/logIn',
    		data: {
    			redirectUrl: appUrl + '/clientActions'
    		}
    	})
    	.then(function(res){
    		$window.location.href = res.data.url;
    	});
	};
});