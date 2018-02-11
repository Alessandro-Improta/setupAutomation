/**
* setupApp Module
*
* Description
*/
angular.module('setupApp', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
		$urlMatcherFactoryProvider.strictMode(false);
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: './logOut/logOut.html',
				controller: 'logOutController'
			})
			.state('newOrLink', {
				url: '/newOrLink',
				templateUrl: './newOrLink/newOrLink.html',
				controller: 'newOrLinkController'
			})
			.state('templateQuestion', {
				url: '/templateQuestion',
				templateUrl: './templateQuestion/templateQuestion.html',
				controller: 'templateQuestionController'
			})
			.state('enterTemplate', {
				url:'/enterTemplate',
				templateUrl: './enterTemplate/enterTemplate.html',
				controller: 'enterTemplateController'
			})
			.state('theater', {
				url:'/theater',
				templateUrl: './theater/theater.html',
				controller: 'theaterController'
			})
			.state('cityState', {
				url:'/cityState',
				templateUrl: './cityState/cityState.html',
				controller: 'cityStateController'
			})
			.state('customerId', {
				url:'/customerId',
				templateUrl: './customerId/customerId.html',
				controller: 'customerIdController'
			})
			.state('website', {
				url:'/website',
				templateUrl: './website/website.html',
				controller: 'websiteController'
			})
			.state('homepage', {
				url:'/homepage',
				templateUrl: './homepage/homepage.html',
				controller: 'homepageController'
			})
			.state('about', {
				url:'/about',
				templateUrl: './about/about.html',
				controller: 'aboutController'
			})
			.state('directions', {
				url:'/directions',
				templateUrl: './directions/directions.html',
				controller: 'directionsController'
			})
			.state('butTickets', {
				url:'/buyTickets',
				templateUrl: './buyTickets/buyTickets.html',
				controller: 'buyTicketsController'
			})
			.state('externalTicketing', {
				url:'/externalTicketing',
				templateUrl: './externalTicketing/externalTicketing.html',
				controller: 'externalTicketingController'
			})
			.state('address', {
				url:'/address',
				templateUrl: './address/address.html',
				controller: 'addressController'
			})
			.state('averageTicketPrice', {
				url:'/averageTicketPrice',
				templateUrl: './averageTicketPrice/averageTicketPrice.html',
				controller: 'averageTicketPriceController'
			})
			.state('accountsLogIn', {
				url:'/accountsLogIn',
				templateUrl: './logIn/accountsLogIn.html',
				controller: 'accountsLogInController'
			})
			.state('accountsActions', {
				url:'/accountsActions',
				templateUrl: './accountsActions/accountsActions.html',
				controller: 'accountsActionsController'
			})
			.state('clientLogIn', {
				url:'/clientLogIn',
				templateUrl: './logIn/clientLogIn.html',
				controller: 'clientLogInController'
			})
			.state('clientActions', {
				url:'/clientActions',
				templateUrl: './clientActions/clientActions.html',
				controller: 'clientActionsController'
			})
			.state('customerIdLink', {
				url:'/customerIdLink',
				templateUrl: './customerIdLink/customerIdLink.html',
				controller: 'customerIdLinkController'
			})
			.state('accountsLogInLink', {
				url:'/accountsLogInLink',
				templateUrl: './logIn/accountsLogIn.html',
				controller: 'accountsLogInLinkController'
			})
			.state('accountsActionsLink', {
				url:'/accountsActionsLink',
				templateUrl: './accountsActionsLink/accountsActionsLink.html',
				controller: 'accountsActionsLinkController'
			})
			.state('clientLogInLink', {
				url:'/clientLogInLink',
				templateUrl: './logIn/clientLogIn.html',
				controller: 'clientLogInLinkController'
			})
			.state('clientActionsLink', {
				url:'/clientActionsLink',
				templateUrl: './clientActionsLink/clientActionsLink.html',
				controller: 'clientActionsLinkController'
			})

		$urlRouterProvider
			.otherwise('/');

		// $locationProvider.hashPrefix('');
		$locationProvider.html5Mode(true);
	})
	