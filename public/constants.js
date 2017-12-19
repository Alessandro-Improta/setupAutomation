angular.module('setupApp').service('constants', function($http){

	let appUrl = 'http://fillyourseats.zapto.org:3000';

	this.appUrl = appUrl;
})