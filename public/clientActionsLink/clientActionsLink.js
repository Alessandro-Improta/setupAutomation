angular.module('setupApp').controller('clientActionsLinkController', function($http, $scope, $location, constants){
	const appUrl = constants.appUrl;
	const path = '/clientActionsLink';
	$scope.show = true;
	$scope.messages = [];

	let setTokens = function() {
		var sliceStart = appUrl.length + path.length + 11;
		var sliceEnd = sliceStart + 89;
		var currentUrl = $location.absUrl();
		var query = '4/' + currentUrl.slice(sliceStart, sliceEnd);
		console.log(query);
		return $http({
			method: 'PUT',
			url: appUrl + '/tokens',
			data: {
				code: query,
				customerId: localStorage.customerId
			}
		})
			.then(function(res) {
				$scope.messages.push(res.data.message);
				console.log(res.data.message);
			})
	};

	let revokeToken = function() {
		return $http.post(appUrl + '/revokeToken')
					.then(function(res){
						$scope.messages.push(res.data.message);
					})
	};

	let acceptLinkRequest = function() {
		return $http({
			method: "POST",
			url: appUrl + '/acceptLinkRequest',
			data: {
				customerId: localStorage.customerId,
				name: localStorage.theater
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message);
		})
	};

	let linkAnalytics = function() {
		return $http({
			method: "POST",
			url: appUrl + '/linkAnalytics',
			data: {
				customerId: localStorage.customerId
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message);
		})
	};

	let goHome = function(){
		$location.path('/newOrLink');
	};

	$scope.startOver = function(){
		revokeToken()
			.then(function(res){
				goHome();
			});
	};

	(function(){
		setTokens()
			.then(function(res) {
				acceptLinkRequest()
					.then(function(res){
						linkAnalytics()
							.then(function(res){		
								$scope.show = false;
							})
					});
			});		
	})();
});