angular.module('setupApp').controller('clientActionsController', function($http, $location, $scope, constants){
	const appUrl = constants.appUrl;
	const path = '/clientActions';
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

	let getTagManagerAccount = function() {
		return $http.get(appUrl + '/getTagManagerAccount')
					.then(function(res) {
						$scope.messages.push(res.data.message);
					});
	};

	let createGTMContainer = function() {
		return $http({
			method: "POST",
			url: appUrl + '/createGTMContainer',
			data: {
				theater: localStorage.theater
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message);
		})
	};

	let getGTMContainer = function() {
		return $http.get(appUrl + '/getGTMContainer')
					.then(function(res) {
						$scope.messages.push(res.data.message);
					})
	};

	let createGTMVariables = function() {
		return $http({
			method: "POST",
			url: appUrl + '/createGTMVariables',
			data: {
				homePageUrl: localStorage.homeageUrl
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message1);
			$scope.messages.push(res.data.message2);
			$scope.messages.push(res.data.message3);
			$scope.messages.push(res.data.message4);
		})
	};

	let createGTMTag = function() {
		return $http.post(appUrl + '/createGTMTag')
					.then(function(res) {
						$scope.messages.push(res.data.message1);
						$scope.messages.push(res.data.message2);
					})
	};

	let createGTMTrigger = function() {
		return $http({
			method: "post",
			url : appUrl + '/createGTMTrigger',
			data: {
				website: localStorage.website
			}
		})
		.then(function(res) {
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

	let getAnalyticsAccount = function() {
		return $http.get(appUrl + '/analyticsAccount')
			.then(function(res) {
				$scope.messages.push(res.data.message);
			})
	};

	let getWebProperties = function() {
		return $http.get(appUrl + '/webProperties')
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

	let getEmail = function() {
		return $http.get(appUrl + '/getEmail')
					.then(function(res) {
						$scope.messages.push(res.data.message);
					})
	};

	let sendEmail = function() {
		return $http.post(appUrl + '/sendEmail')
					.then(function(res) {
						$scope.messages.push(res.data.message);
					})
	};

	let getProfiles = function() {
		return $http.get(appUrl + '/getProfiles')
			.then(function(res) {
			 	$scope.messages.push(res.data.message);
			 })
	};

	let createGoal = function() {
		return $http.post(appUrl + '/createGoal')
			.then(function(res) {
				$scope.messages.push(res.data.message);
			})
	};

	let endLink = function() {
		return $http({
			method: 'POST',
			url: appUrl + '/endLink',
			data: {
				customerId: localStorage.customerId,
				name: localStorage.theater
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message);
		})
	};

	let download = function(filename, csv) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csv));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	};

	$scope.downloadCsvs = function() {
		let arr = JSON.parse(localStorage.csvs);
		for (let i = 0; i < arr.length; i++) {
			let filename = localStorage.theater + i;
			download(filename, arr[i]);
		};
	};

	let goHome = function(){
		$location.path('/newOrLink');
	};

	$scope.startOver = function(){
		endLink()
			.then(function(res){
				revokeToken()
					.then(function(res){
						goHome();
					});
			})
	};

	(function(){
		setTokens()
			.then(function(res) {
				getTagManagerAccount()
					.then(function(res){
						createGTMContainer()
							.then(function(res) {
								getGTMContainer()
									.then(function(res) {
										getEmail()
											.then(function(res) {
												sendEmail()
													.then(function(res){
														createGTMTrigger()
															.then(function(res){
																createGTMTag()
																	.then(function(res){
																		acceptLinkRequest()
																			.then(function(res){
																				getAnalyticsAccount()
																					.then(function(res){
																						getWebProperties()
																							.then(function(res){
																								getProfiles()
																									.then(function(res){
																										createGoal()
																											.then(function(res){
																												$scope.show = false;
																												linkAnalytics()
																													.then(function(res){
																														createGTMVariables()						
																													})
																											})
																									})
																							})
																					})
																			})
																	})
															})
													})
											})
									})
							})
					})
			})
	})();
});