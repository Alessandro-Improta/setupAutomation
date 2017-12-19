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
				addData(keys, values);
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
	};

	$scope.startOver = function(){
		clearData();
		revokeToken()
			.then(function(res){
				goHome();
			});
	};

	let clearData = function() {
		return localStorage.clear();
	};

	let goHome = function(){
		$location.path('home');
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
		for(var i = 0; i < keys.length; i++) {
			localStorage.setItem(keys[i], values[i]);
		}
		return console.log(localStorage);
	};

	let getTemplate = function() {
		return $http.get(appUrl + '/template')
					.then(function(res){
						console.log(res.data.message);
					})
	};

	let setTokens = function() {
		var sliceStart = appUrl.length + 7;
		var sliceEnd = sliceStart + 89;
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
    					localStorage.setItem("loggedInAgain", "true");
    					redirectUrl = res.data.url;
    					$window.location.href = redirectUrl;
    				});
	};

});