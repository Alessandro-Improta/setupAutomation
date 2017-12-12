angular.module('setupApp').service('constants', function($http){

	this.appUrl = 'http://localhost:3000';

	let inputData = {};

	this.getData = function() {
		return $http.get('http://localhost:3000' + '/data')
					.then(function(res){
						inputData = res.data.inputData;
						return inputData;
					})
	};
})