angular.module('setupApp').service('constants', function($http){

	// const appUrl = 'http://fillyourseatssetup.zapto.org:3000';
	const appUrl = 'http://localhost:3000'


	this.appUrl = appUrl;
})