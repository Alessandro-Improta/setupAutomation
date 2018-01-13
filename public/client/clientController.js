angular.module('setupApp').controller('clientController', function($http, $scope, constants, $location){

	const appUrl = constants.appUrl;
	let inputData = localStorage;

	// Testing
	// ********************************************************
	let adwordsAccount = function() {
		$http.get(appUrl + '/adwordsAccount')
			 .then(function(res) {
			 	console.log(res.data.message);
			 })
	};
	// ********************************************************


	let setTokens = function() {
		var sliceStart = appUrl.length + 7;
		var sliceEnd = sliceStart + 89;
		var currentUrl = $location.absUrl();
		var query = currentUrl.slice(sliceStart, sliceEnd);
		return $http({
			method: 'PUT',
			url: appUrl + '/tokens',
			data: {
				code: query,
				customerId: localStorage.customerId
			}
		})
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

	let getTagManagerAccount = function() {
		return $http.get(appUrl + '/getTagManagerAccount')
					.then(function(res) {
						console.log(res.data.message);
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
			console.log(res.data.message);
		})
	};

	let getGTMContainer = function() {
		return $http.get(appUrl + '/getGTMContainer')
					.then(function(res) {
						console.log(res.data.message);
					})
	};

	let createGTMVariables = function() {
		return $http({
			method: "POST",
			url: appUrl + '/createGTMVariables',
			data: {
				homePageUrl: localStorage.homePageUrl
			}
		})
		.then(function(res) {
			console.log(res.data.message1);
			console.log(res.data.message2);
			console.log(res.data.message3);
			console.log(res.data.message4);
		})
	};

	let createGTMTag = function() {
		return $http.post(appUrl + '/createGTMTag')
					.then(function(res) {
						console.log(res.data.message1);
						console.log(res.data.message2);
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
			console.log(res.data.message);
		})
	};

	let acceptLinkRequest = function() {
		return $http({
			method: "POST",
			url: appUrl + '/acceptLinkRequest',
			data: {
				customerId: localStorage.customerId
			}
		})
		.then(function(res) {
			console.log(res.data.message);
		})
	};

	let getAnalyticsAccount = function() {
		return $http.get(appUrl + '/analyticsAccount')
			.then(function(res) {
				console.log(res.data.message);
			})
	};

	let getWebProperties = function() {
		return $http.get(appUrl + '/webProperties')
					.then(function(res) {
						console.log(res.data.message);
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
			console.log(res.data.message);
		})
	};

	$scope.startOver = function(){
		endLink()
			.then(function(res) {		
				clearData();
				revokeToken()
					.then(function(res){
						goHome();
					});
			})
	};

	let goHome = function(){
		$location.path('home');
	};

	let getEmail = function() {
		return $http.get(appUrl + '/getEmail')
					.then(function(res) {
						console.log(res.data.message);
					})
	};

	let sendEmail = function() {
		return $http.post(appUrl + '/sendEmail')
					.then(function(res) {
						console.log(res.data.message);
					})
	};

	let clearData = function() {
		return localStorage.clear();
	};

	let getProfiles = function() {
		return $http.get(appUrl + '/getProfiles')
			.then(function(res) {
			 	console.log(res.data.message);
			 })
	};

	let createGoal = function() {
		return $http.post(appUrl + '/createGoal')
			.then(function(res) {
				console.log(res.data.message);
			})
	};

	let endLink = function() {
		return $http({
			method: 'POST',
			url: appUrl + '/endLink',
			data: {
				customerId: localStorage.customerId
			}
		})
		.then(function(res) {
			console.log(res.data.message);
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


	(function(){
		$scope.show = true;
		setTokens()
			.then(function(res) {
				adwordsAccount();
				if (localStorage.justLinking) {
					acceptLinkRequest()
						.then(function(res){
							linkAnalytics()
								.then(function(res){		
									localStorage.clear();
									$scope.show = false;
									revokeToken();
									return;
								})
						});
				} else {
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
				}
			})
	})();

})


	
	

	
