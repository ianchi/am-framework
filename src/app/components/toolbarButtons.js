angular.module('amFramework')
	.component('amfToolbarButtons', {
		replace: false,
		transclude: false,
		bindings: { buttons: '<' },
		templateUrl: 'app/components/toolbarButtons.tmpl.html'
	});
