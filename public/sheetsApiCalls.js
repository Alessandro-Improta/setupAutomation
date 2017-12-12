angular.module('setupApp').controller('logIn', function($scope, $http, $location, $window){

	var appUrl = 'http://localhost:3000'
	var redirectUrl;
	var loggedIn = false;
	$scope.boolean = false;

	$scope.changeStateToMain = function() {
		$location.path('/main')
	}

	$scope.getUrl = function (){
    	return $http.get(appUrl + '/url')
    				.then(function(res){
    					redirectUrl = res.data.url;
    					$scope.url = res.data.url;
    					$scope.boolean = true;
    					loggedIn = true;
    					$window.location.href = redirectUrl;
    				});
		}

	$scope.getAndSetTokens = function() {
		var sliceStart = appUrl.length + 7;
		var currentUrl = $location.absUrl();
		var query = currentUrl.slice(sliceStart);
		return $http({
			method: 'PUT',
			url: appUrl + '/tokens',
			data: {
				code: query,
				customerId: $scope.customerId
			}
		})
			.then(function(res) {
				boolean = false;
				console.log(res.data.message);
			})
	}

	
	$scope.getTemplate = function() {
		return $http.get(appUrl + '/template')
					.then(function(res){
						console.log(res.data.message);
						return $http({
							method: 'POST',
							url: appUrl + '/newAccount',
							data: {
								title: $scope.theater + ".csv"
							}
						})
						.then(function(res) {
							console.log(res.data.message)
						})
					})
	}

	$scope.findAndReplace = function() {
		replaceItems.push($scope.theater);
		replaceItems.push($scope.theater);
		replaceItems.push($scope.city);
		replaceItems.push($scope.state);
		fillRequestsArray();
		console.log(requests);
		return $http({
			method: 'PUT',
			url: appUrl + '/findAndReplace',
			data: {
				requests: {requests: requests}
			}
		})
		.then(function(res) {
			console.log(res.data.message);
			console.log(res.data.fnrResponse);
		})
	}

	$scope.getTagManagerAccount = function() {
		return $http.get(appUrl + '/getTagManagerAccount')
					.then(function(res) {
						console.log(res.data.message);
					});
	}

	$scope.createGTMContainer = function() {
		return $http.post(appUrl + '/createGTMContainer')
					.then(function(res) {
						console.log(res.data.message);
					})
	}

	$scope.createGTMTag = function() {
		return $http.post(appUrl + '/createGTMTag')
					.then(function(res) {
						console.log(res.data.message1);
						console.log(res.data.message2);
					})
	}

	$scope.createGTMTrigger = function() {
		return $http.post(appUrl + '/createGTMTrigger')
					.then(function(res) {
						console.log(res.data.message);
					})
	}


	let requests = []
	const findItems    = ['{Theatre Name}', '{Name Short}', '{City}', '{State}']
	const replaceItems = [];

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

});

