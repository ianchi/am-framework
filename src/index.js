/* eslint angular/controller-as:0 */

angular
	.module('app', ['ui.router', 'chart.js', 'amFramework'])
	.config(function($mdIconProvider) {
		$mdIconProvider.defaultIconSet('app/resources/images/mdi.svg');
	})
	.controller('AppController', function($scope) {
		$scope.graph = {};
		$scope.graph.labels = ['buffered', 'free', 'used'];
		$scope.graph.data = [5, 20, 75];
		$scope.thisYear = new Date().getFullYear();

		$scope.menuItems = [
			{
				icon: '',
				name: 'Status',
				childs: [{
					name: 'Dashboard',
					sref: 'dashboard'
				}, {
					name: 'Logs',
					sref: 'logs'
				},
            { name: 'Processes' },
              { name: 'Realtime' }

				]

			},
			{
				name: 'System',
				sref: '/'
			},
			{
				name: 'Network',
				sref: '/'
			},
			{
				name: 'Security',
				sref: '/',
				childs: [
					{
						name: 'OpenVPN',
						sref: 'OpenVPN'
					},
                { name: 'Transmission' },
                { name: 'DDNS' }]
			},
			{
				name: 'Apps',
				sref: 'apps',
				childs: [
					{
						name: 'OpenVPN',
						sref: 'OpenVPN'
					},
                { name: 'Transmission' },
                { name: 'DDNS' }]
			}];
		$scope.toolbar = [
			{
				name: 'button1',
				icon: 'border-color',
				label: '',
				notifLabel: '3',
				click: function() {},
				menu: [
					{
						name: 'Commit',
						icon: 'content-save',
						label: 'Commit',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					},
					{
						name: 'Reset',
						icon: 'undo',
						label: 'Reset',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					}]
			},
			{
				name: 'button1',
				icon: 'account-circle',
				label: '',
				notifLabel: '',
				click: function() {},
				menu: [
					{
						label: 'root',
						icon: 'account-check'
					},
					{
						label: 'Expert Mode',
						icon: 'tune'
					},
					{
						name: 'Reboot',
						icon: 'lock-outline',
						label: 'Change Password',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					},
					{
						name: 'Reboot',
						icon: 'logout-variant',
						label: 'Logout',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					}]
			},
			{
				name: 'button1',
				icon: 'power-settings',
				label: '',
				notifLabel: '',
				click: function() {},

				menu: [
					{
						name: 'Reboot',
						icon: 'reload',
						label: 'Reboot',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					},
					{
						name: 'Reboot',
						icon: 'translate',
						label: 'Languaje',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					},
					{
						name: 'Reboot',
						icon: 'palette',
						label: 'Theme',
						click: function() {
							alert('are you shure?');
						},
						sref: ''
					}]
			}];
	})
	.run(function($mdDialog, $document) {
		$mdDialog.show({
			partent: $document,
			templateUrl: 'app/components/loginDialog.tmpl.html',
			controller: 'LoginDialogController',
			controllerAs: 'vm'
		});
	});
