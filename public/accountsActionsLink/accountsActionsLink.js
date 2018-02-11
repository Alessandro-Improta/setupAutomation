angular.module('setupApp').controller('accountsActionsLinkController', function($scope, $http, $location, constants) {
	const appUrl = constants.appUrl;
	const path = '/accountsActionsLink';
	$scope.show = true;
	let title;
	let csvs = [];
	$scope.messages = ['Done tasks:'];

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
				code: query
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
						console.log(res.data.message);
					})
	};

	let sendLinkRequest = function() {
		return $http({
			method: "POST",
			url: appUrl + '/sendLinkRequest',
			data: {
				customerId: localStorage.customerId,
				name: localStorage.theater
			}
		})
		.then(function(res){
			$scope.messages.push(res.data.message);
			console.log(res.data.message);
		})
	};

	$scope.toClientLogInLink = function() {
		revokeToken()
			.then(function(res){
				$location.path('/clientLogInLink')
			});
	};

	(function() {
		setTokens()
			.then(function(res){
				sendLinkRequest()
					.then(function(res){
						$scope.show = false;
						console.log($scope.messages);
					});
			});
	})();


});