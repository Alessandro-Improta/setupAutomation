angular.module('setupApp').controller('mainController', function($scope, $location, $http, $window, constants){

	var appUrl = constants.appUrl;
	$scope.show = true;
	$scope.show1 = false;
	$scope.show2 = false;
	let inputData;
	let csvs = [];
	const templateIds = {
		1: '1kO2kc43hlcxwqU3LDkAutZkddO4FrXpgafFEQJsTjmk',
		2: '1F4zwvoXEPmZp3nYrelwFa39pd7cb_9ZiXR0grodauA0',
		3: '1STsOrCzZrkRbLVjAIHP9fFCL541mfO7ns7LUQVEnyic'
	}
	let templatesArr = [];
	for (const prop in templateIds) {
		templatesArr.push(templateIds[prop]);
	}

	console.log(typeof $scope.templateId, templatesArr);

	$scope.mainAccountActions = function() {
		$scope.show = false;
		$scope.show1 = true;
		let keys = ['templateId', 'theater', 'city', 'state', 'customerId', 'website', 'homePageUrl', 'aboutUrl', 'directionsUrl', 'buyTicketsUri', 'addressOfTheater', 'conversionUrl', 'conversionValue'];
		let values = [$scope.templateId, $scope.theater, $scope.city, $scope.state, $scope.customerId, $scope.website, $scope.homePageUrl, $scope.aboutUrl, $scope.directionsUrl, $scope.buyTicketsUri, $scope.addressOfTheater, $scope.conversionUrl, $scope.conversionValue];
		addData(keys, values);
		inputData = localStorage;
		sendLinkRequest()
			.then(function(res){
				if (localStorage.templateId === 'undefined') {
					createNewAccountSpreadsheets();
				} else {
					createNewAccountSpreadsheetsFromCustomTemplate();
				}
			})
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
		return console.log(localStorage);
	};

	let createNewAccountSpreadsheetsFromCustomTemplate = function() {
		getTemplate(localStorage.templateId)
			.then(function(res) {
				uploadCopyOfTemplate()
					.then(function(res) {
						findAndReplace()
							.then(function(res) {
								getCsvData()
									.then(function(res) {
										revokeToken()
											.then(function(res){
												$scope.show1 = false;
												$scope.show2 = true;
											});
									})
							});
					});
			});
	};

	let createNewAccountSpreadsheets = function() {
		let counter = 0;
		let templateId;
		for (let i = 0; i < templatesArr.length; i++) {
			counter += 1;
			templateId = templatesArr[i];
			getTemplate(templateId)
				.then(function(res) {
					uploadCopyOfTemplate(counter)
						.then(function(res){
							findAndReplace()
								.then(function(res) {
									getCsvData()
										.then(function(res) {
											revokeToken()
												.then(function(res){
													$scope.show1 = false;
													$scope.show2 = true;
												});
										})
								})
						});
				});
		};
	};

	let getTemplate = function(id) {
		let templateId = id;
		return $http({
			method: "GET",
			url: appUrl + '/template',
			data: {
				templateId: templateId
			}
		})
		.then(function(res){
			console.log(res.data.message);
		})
	};

	let uploadCopyOfTemplate = function(num) {
		let title;
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
							csvs.push(res.data.data);
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