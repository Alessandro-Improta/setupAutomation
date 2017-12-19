angular.module('setupApp').service('constants', function($http){

	let appUrl = 'http://192.168.0.100:3000';

	this.appUrl = appUrl;

	let inputData = {};

	this.getData = function() {
		return $http.get(appUrl + '/data')
					.then(function(res){
						inputData = res.data.inputData;
						return inputData;
					})
	};
})