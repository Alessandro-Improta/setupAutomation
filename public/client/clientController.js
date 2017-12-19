angular.module('setupApp').controller('clientController', function($http, $scope, constants, $location){

	const appUrl = constants.appUrl;
	let inputData = localStorage;

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
				customerId: localStorage.customerId;
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

	let uploadCopyOfTemplate = function() {
		return $http({
			method: 'POST',
			url: appUrl + '/newAccount',
			data: {
				title: inputData.theater 
			}
			})
			.then(function(res) {
				console.log(res.data.message)
			})
	};

	let findAndReplace = function() {
		let requests = []
		let replaceItems = [];
		const findItems    = ['{Theatre Name}', '{Name Short}', '{City}', '{State}']
		replaceItems.push(inputData.theater);
		replaceItems.push(inputData.theater);
		replaceItems.push(inputData.city);
		replaceItems.push(inputData.state);
		let fillRequestsArray = function () {
			for (let i = 0; i < findItems.length; i++) {
				requests.push({
		  			findReplace: {
		    			find: findItems[i],
		    			replacement: replaceItems[i],
		    			allSheets: true
		  			}
				});
			}
		}
		fillRequestsArray();
		requests.push({
			updateSpreadsheetProperties: {
				properties: {
					title: "batchUpdate.csv"
				},
				fields: '*'
			}
		});
		return $http({
			method: 'PUT',
			url: appUrl + '/findAndReplace',
			data: {
				requests: {requests: requests}
			}
		})
		.then(function(res) {
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
		return $http.({
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
		return $http.({
			method: "POST",
			url: appUrl + '/createGTMVariables',
			data: {
				homePageUrl: localStorage.homePageUrl;
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
		return $http.({
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

	let adwordsTest = function() {
		return $http.get(appUrl + '/test')
					.then(function(res) {
						console.log(res.data.message);
					})
	};

	let acceptLinkRequest = function() {
		return $http.post(appUrl + '/acceptLinkRequest')
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
		return $http.({
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
		revokeToken()
			.then(function(res) {
				clearData()
					.then(function(res){
						goHome();
					});
			});
	};

	let goHome = function(){
		$location.path('/');
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
		return localStorage = {};
	};

	(function(){
		$scope.show = true;
				setTokens()
					.then(function(res) {
						uploadCopyOfTemplate()
							.then(function(res) {
								findAndReplace()
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
			})
	})();

})


	
	

	
