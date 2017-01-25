angular.module('amFramework')
	.directive('amfPanel', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				title: '@',
				template: '@',
				options: '@',
				icon: '@',
				data: '='
			},
			templateUrl: 'app/components/panel.tmpl.html'
		};
	});
