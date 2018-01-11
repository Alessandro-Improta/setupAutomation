angular.module('setupApp').controller('mainController', function($scope, $location, $http, $window, constants, $q){

	var appUrl = constants.appUrl;
	$scope.show = true;
	$scope.show1 = false;
	$scope.show2 = false;
	let inputData;
	let title;
	const templateIds = {
		1: '1STsOrCzZrkRbLVjAIHP9fFCL541mfO7ns7LUQVEnyic',
		2: '1F4zwvoXEPmZp3nYrelwFa39pd7cb_9ZiXR0grodauA0',
		3: '1kO2kc43hlcxwqU3LDkAutZkddO4FrXpgafFEQJsTjmk'
	}
	let templatesArr = [];
	for (const prop in templateIds) {
		templatesArr.push(templateIds[prop]);
	}

	$scope.mainAccountActions = function() {
		let counter = 0;
		let keys = ['templateId', 'theater', 'city', 'state', 'customerId', 'website', 'homePageUrl', 'aboutUrl', 'directionsUrl', 'buyTicketsUri', 'addressOfTheater', 'conversionUrl', 'conversionValue'];
		let values = [$scope.templateId, $scope.theater, $scope.city, $scope.state, $scope.customerId, $scope.website, $scope.homePageUrl, $scope.aboutUrl, $scope.directionsUrl, $scope.buyTicketsUri, $scope.addressOfTheater, $scope.conversionUrl, $scope.conversionValue];
		$scope.show = false;
		$scope.show1 = true;
		addData(keys, values);
		sendLinkRequest()
			.then(function(res){
				if (localStorage.templateId === 'undefined') {
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
					createEmptySpreadsheet(newNum)
						.then(function(res) {
							copyTemplateTo(id)
								.then(function(res) {
									deleteEmptySheetInNewSpreadsheet()
										.then(function(res) {
											findAndReplace()
												.then(function(res) {
													counter +=1
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
	};

	let createNewAccountSpreadsheets = function(num) {
		let deferred = $q.defer();
		deferred.resolve('done');
		let id;
		let newNum;

		if (localStorage.templateId !== 'undefined') {
			id = localStorage.templateId;
		} else {
			id = templatesArr[num];
		}
		
		if (num) {
			newNum = num + 1;	
		} else {
			newNum = '';
		}


		createEmptySpreadsheet(newNum)
			.then(function(res) {
				copyTemplateTo(id)
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
	};

	$scope.startOver = function(){
		clearData();
		revokeToken()
			.then(function(res){
				goHome();
			});
	};

	$scope.secondLogIn = function() {
		secondLogIn();
	}

	$scope.relink = function() {
		localStorage.setItem('customerId', $scope.customerId);
		sendLinkRequest()
			.then(function(res){
				localStorage.setItem('justLinking', true);
				revokeToken()
					.then(function(res){
						secondLogIn();
					})
			});
	};

	$scope.linking = false;

	$scope.getCustomerId = function() {
		$scope.linking = true;
	}

	let clearData = function() {
		return localStorage.clear();
	};

	let goHome = function(){
		$location.path('home');
	};

	let sendLinkRequest = function() {
		return $http({
			method: "POST",
			url: appUrl + '/sendLinkRequest',
			data: {
				customerId: localStorage.customerId
			}
		})
		.then(function(res){
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
		inputData = localStorage;
		return console.log(inputData);
	};							

	let createEmptySpreadsheet = function(num) {
		if (num) {
			title = inputData.theater + num;
		} else {
			title = inputData.theater;
		}

		return $http({
			method: 'POST',
			url: appUrl + '/newAccount',
			data: {
				title: title
			}
		})
		.then(function(res) {
			console.log(res.data.message)
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
			console.log(res.data.message);
		})
	};

	let deleteEmptySheetInNewSpreadsheet = function() {
		return $http.put(appUrl + '/deleteEmptySheetInNewSpreadsheet')
					.then(function(res) {
						console.log(res.data.message);
					})
	}


	let findAndReplace = function() {
		let requests = []
		let replaceItems = [];
		const findItems    = ['{Theatre Name}', '{Name Short}', '{City}', '{State}', 'http://www.fillyourseats.com', 'http://www.fillyourseats.com/contact-us', 'http://www.fillyourseats.com/ugly', 'http://www.fillyourseats.com/subscribe-w-stripe', 'http://www.fillyourseats.com/contact', 'http://www.fillyourseats.com/details']
		replaceItems.push(inputData.theater);
		replaceItems.push(inputData.theater);
		replaceItems.push(inputData.city);
		replaceItems.push(inputData.state);
		replaceItems.push(inputData.website);
		replaceItems.push(inputData.buyTicketsUrl);
		replaceItems.push(inputData.aboutUrl);
		replaceItems.push(inputData.directionUrl);
		replaceItems.push(inputData.buyTicketsUrl);
		replaceItems.push(inputData.buyTicketsUrl);

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

	let secondLogIn = function() {
		return $http.get(appUrl + '/secondLogIn')
    				.then(function(res){
    					localStorage.setItem("loggedInAgain", "true");
    					redirectUrl = res.data.url;
    					$window.location.href = redirectUrl;
    				});
	};


	let getCsvData = function() {
		return $http.get(appUrl + '/getCsvData')
					.then(function(res) {
						console.log(res.data.message);
						if (res.data.data) {
							localStorage.setItem(title, csvs);
						}
					})
	};

	$scope.downloadCSV = function (filename, data) {  
       	
        var csv = data;

        let filename = filename + '.csv' || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        let preparedData = encodeURI(csv);

        let link = document.createElement('a');
        link.setAttribute('href', preparedData);
        link.setAttribute('download', filename);
        link.click();
    };



	(function(){
		setTokens();
	})()
});