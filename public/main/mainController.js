angular.module('setupApp').controller('mainController', function($scope, $location, $http, $window, constants){

	var appUrl = constants.appUrl;
	$scope.show = true;
	$scope.show1 = false;
	$scope.show2 = false;
	let inputData;

	$scope.mainAccountActions = function() {
		$scope.show = false;
		$scope.show1 = true;
		let keys = ['templateId', 'theater', 'city', 'state', 'customerId', 'website', 'homePageUrl', 'aboutUrl', 'directionsUrl', 'buyTicketsUri', 'addressOfTheater', 'conversionUrl', 'conversionValue'];
		let values = [$scope.templateId, $scope.theater, $scope.city, $scope.state, $scope.customerId, $scope.website, $scope.homePageUrl, $scope.aboutUrl, $scope.directionsUrl, $scope.buyTicketsUri, $scope.addressOfTheater, $scope.conversionUrl, $scope.conversionValue];
		addData(keys, values);
		inputData = localStorage;
		sendLinkRequest()
			.then(function(res){
				getTemplate()
					.then(function(res){
						uploadCopyOfTemplate()
							.then(function(res) {
								findAndReplace()
									.then(function(res) {
										downloadNewAccount()
											.then(function(res) {
												revokeToken()
													.then(function(res){
														$scope.show1 = false;
														$scope.show2 = true;
													});
											})
									})
							})
					});
			});
	};

	//testing
	//*********
		$scope.getTemplate = function() {
			getTemplate()
		};

		$scope.upload = function() {
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

		$scope.getCsv = function() {
			downloadNewAccount();
		};


	//*****

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
		return $http({
			method: "GET",
			url: appUrl + '/template',
			data: {
				templateId: localStorage.templateId
			}
		})
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


	let downloadNewAccount = function() {
		return $http.get(appUrl + '/downloadNewAccount')
					.then(function(res) {
						console.log(res.data.message);
						csvs = res.data.data;
						downloadCSV('1.csv', csvs[0]);
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