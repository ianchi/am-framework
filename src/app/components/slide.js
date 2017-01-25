angular.module('amFramework')
	.directive('amfSlide', function() {
		return {
			restrict: 'A',
			transclude: true,
			template: '<div class="amf-slide-content"><ng-transclude/></div>',
			scope: { amfSlide: '<' },

			controller: function() {},
			controllerAs: '$ctrl',
			link: postLink
		};
	});

function postLink(scope, element, attr, $ctrl) {
	$ctrl.element = element;
	element.addClass('amf-slide-wrapper');
	$ctrl.content = element.children('.amf-slide-content');

	scope.$watch('amfSlide', function amfSlideWatchAction(value) {
		if (value) {
			$ctrl.element.css({ height: $ctrl.content[0].clientHeight + 'px' });
		} else {
			$ctrl.element.css({ height: '0px' });
		}
	});
}
