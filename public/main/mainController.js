angular.module('setupApp').controller('mainController', function($scope, $location, $http, $window, constants){

	var appUrl = constants.appUrl;
	$scope.show = true;
	$scope.show1 = false;
	$scope.show2 = false;

	$scope.mainAccountActions = function() {
		$scope.show = false;
		$scope.show1 = true;
		let keys = ['theater', 'city', 'state', 'customerId', 'website', 'homePageUrl', 'aboutUrl', 'directionsUrl', 'buyTicketsUri', 'addressOfTheater', 'conversionUrl', 'conversionValue'];
		let values = [$scope.theater, $scope.city, $scope.state, $scope.customerId, $scope.website, $scope.homePageUrl, $scope.aboutUrl, $scope.directionsUrl, $scope.buyTicketsUri, $scope.addressOfTheater, $scope.conversionUrl, $scope.conversionValue];
		setTokens()
			.then(function(res){
				addData(keys, values)
					.then(function(res){
						sendLinkRequest()
							.then(function(res){
								getTemplate()
									.then(function(res){
										revokeToken()
											.then(function(res){
												$scope.show1 = false;
												$scope.show2 = true;
											});
									});
							});
					});
			});
	};

	$scope.startOver = function(){
		revokeToken();
		return $http.put(appUrl + '/startOver')
					.then(function(res) {
						$location.path('/');
					})
	};

	let sendLinkRequest = function() {
		return $http.post(appUrl + '/sendLinkRequest')
					.then(function(res){
						console.log(res.data.message);
					})
	};

	let adwordsTest = function() {
		return $http.get(appUrl + '/test')
					.then(function(res) {
						console.log(res.data.message);
					})
	};

	let getAdwordsAccount = function() {
		return $http.get(appUrl + '/adwordsAccount')
					.then(function(res) {
						console.log(res.data.message);
					})
	};

	let revokeToken = function() {
		return $http.post(appUrl + '/revokeToken')
					.then(function(res){
						console.log(res.data.message);
					})
	};

	let addData = function(keys, values) {
		return $http({
			method: 'PUT',
			url: appUrl + '/addData',
			data: {
				keys: keys,
				values: values
			}
		})
		.then(function(res) {
			console.log(res.data.message);
		})
	};

	let getTemplate = function() {
		return $http.get(appUrl + '/template')
					.then(function(res){
						console.log(res.data.message);
					})
	};

	let setTokens = function() {
		var sliceStart = appUrl.length + 7;
		var sliceEnd = sliceStart + 45;
		var currentUrl = $location.absUrl();
		var query = currentUrl.slice(sliceStart, sliceEnd);
		return $http({
			method: 'PUT',
			url: appUrl + '/tokens',
			data: {
				code: query
			}
		})
			.then(function(res) {
				console.log(res.data.message);
			})
	};

	$scope.secondLogIn = function() {
		return $http.get(appUrl + '/secondLogIn')
    				.then(function(res){
    					redirectUrl = res.data.url;
    					$window.location.href = redirectUrl;
    				});
	};

});