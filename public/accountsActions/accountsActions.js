angular.module('setupApp').controller('accountsActionsController', function($http, $scope, $location, constants){
	const appUrl = constants.appUrl;
	const path = '/accountsActions';
	$scope.show = true;
	let title;
	let csvs = [];
	const templateIds = {
		1: '1STsOrCzZrkRbLVjAIHP9fFCL541mfO7ns7LUQVEnyic',
		2: '1F4zwvoXEPmZp3nYrelwFa39pd7cb_9ZiXR0grodauA0',
		3: '1kO2kc43hlcxwqU3LDkAutZkddO4FrXpgafFEQJsTjmk'
	}
	let templatesArr = [];
	for (const prop in templateIds) {
		templatesArr.push(templateIds[prop]);
	};
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
				code: query
			}
		})
			.then(function(res) {
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
		})
	};

	let revokeToken = function() {
		return $http.post(appUrl + '/revokeToken')
					.then(function(res){
						$scope.messages.push(res.data.message);
					})
	};

	let createEmptySpreadsheet = function(num) {
		if (num) {
			title = localStorage.theater + num;
		} else {
			title = localStorage.theater;
		}

		return $http({
			method: 'POST',
			url: appUrl + '/newAccount',
			data: {
				title: title
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message)
		})
	};

	let copyTemplateTo = function(id) {
		return $http({
			method: "PUT",
			url: appUrl + '/template',
			data: {
				templateId: id
			}
		})
		.then(function(res){
			$scope.messages.push(res.data.message);
		})
	};

	let deleteEmptySheetInNewSpreadsheet = function() {
		return $http.put(appUrl + '/deleteEmptySheetInNewSpreadsheet')
					.then(function(res) {
						$scope.messages.push(res.data.message);
					})
	}


	let findAndReplace = function() {
		let requests = []
		let replaceItems = [];
		const findItems    = ['{Theatre Name}', '{Name Short}', '{City}', '{State}', 'http://www.fillyourseats.com', 'http://www.fillyourseats.com/contact-us', 'http://www.fillyourseats.com/ugly', 'http://www.fillyourseats.com/subscribe-w-stripe', 'http://www.fillyourseats.com/contact', 'http://www.fillyourseats.com/details']
		replaceItems.push(localStorage.theater);
		replaceItems.push(localStorage.theater);
		replaceItems.push(localStorage.city);
		replaceItems.push(localStorage.state);
		replaceItems.push(localStorage.website);
		replaceItems.push(localStorage.buyTicketsUrl);
		replaceItems.push(localStorage.aboutUrl);
		replaceItems.push(localStorage.directionUrl);
		replaceItems.push(localStorage.buyTicketsUrl);
		replaceItems.push(localStorage.buyTicketsUrl);

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
		
		return $http({
			method: 'PUT',
			url: appUrl + '/findAndReplace',
			data: {
				requests: {requests: requests}
			}
		})
		.then(function(res) {
			$scope.messages.push(res.data.message);
		})
	};

	let getCsvData = function() {
		return $http.get(appUrl + '/getCsvData')
					.then(function(res) {
						$scope.messages.push(res.data.message);
						if (res.data.data) {
							csvs.push(res.data.data);
							localStorage.setItem('csvs', JSON.stringify(csvs));
						}
					})
	};

	$scope.toClientLogIn = function() {
		revokeToken()
			.then(function(res){
				$location.path('/clientLogIn')
			});
	};

	(function() {
		let counter = 0;
		$scope.show = false;
		setTokens()
			.then(function(res){
				sendLinkRequest()
					.then(function(res){
						if (!localStorage.templateId) {
							createEmptySpreadsheet(counter)
								.then(function(res) {
									copyTemplateTo(templateIds[1])
										.then(function(res) {
											deleteEmptySheetInNewSpreadsheet()
												.then(function(res) {
													findAndReplace()
														.then(function(res) {
															counter +=1
															getCsvData()
																.then(function(res) {
																	createEmptySpreadsheet(counter)
																		.then(function(res) {
																			copyTemplateTo(templateIds[2])
																				.then(function(res) {
																					deleteEmptySheetInNewSpreadsheet()
																						.then(function(res) {
																							findAndReplace()
																								.then(function(res) {
																									counter +=1
																									getCsvData()
																										.then(function(res) {
																											createEmptySpreadsheet(counter)
																												.then(function(res) {
																													copyTemplateTo(templateIds[3])
																														.then(function(res) {
																															deleteEmptySheetInNewSpreadsheet()
																																.then(function(res) {
																																	findAndReplace()
																																		.then(function(res) {
																																			counter +=1
																																			getCsvData()
																																		});
																																});
																														});
																												});			
																										});
																								});
																						});
																				});
																		});			
																});
														});
												});
										});
								});			
						} else {
							createEmptySpreadsheet(counter)
								.then(function(res) {
									copyTemplateTo(localStorage.templateId)
										.then(function(res) {
											deleteEmptySheetInNewSpreadsheet()
												.then(function(res) {
													findAndReplace()
														.then(function(res) {
															getCsvData()
																.then(function(res) {
																	revokeToken();
																});
														});
												});
										});
								});			
						}
					});
			});
	})();
});