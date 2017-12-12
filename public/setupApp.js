/**
* setup Module
*
* Description
*/
angular.module('setupApp', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: './login/login.html',
				controller: 'logIn'
			})
			.state('main', {
				url: '/main',
				templateUrl: './main/main.html',
				controller: 'mainController'
			})
			.state('client', {
				url: '/client',
				templateUrl: './client/client.html',
				controller: 'clientController'
			});

		$urlRouterProvider
			.otherwise('/');
	});
	