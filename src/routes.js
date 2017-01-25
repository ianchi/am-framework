'use strict';

angular
	.module('app')
	.config(routesConfig);

function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
	// $locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise('/status/dashboard');

	$stateProvider
		.state('Status', { abstract: true, url: '/status', template: '<div class="ui-view"></div>' })
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'views/dashboard.html',
			parent: 'Status',
			data: { title: 'Dashboard' }
		})
		.state('apps', { abstract: true, url: '/apps', template: '<div class="ui-view"></div>' })
		.state('OpenVPN', {
			parent: 'apps',
			url: '/openvpn',
			templateUrl: 'views/apps.html',
			data: { title: 'Applications' }
		});
}
