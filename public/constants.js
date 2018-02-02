angular.module('setupApp').service('constants', function($http){

	let appUrl = 'http://fillyourseatssetup.zapto.org:3000';

	this.appUrl = appUrl;
})