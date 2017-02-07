(function() {
'use strict';
'use strict';

angular
	.module('amFramework', ['ngMaterial', 'ngAnimate', 'ui.router', 'ngMessages'])
	.config(['$mdThemingProvider', function($mdThemingProvider) {
		'ngInject';

		$mdThemingProvider.theme('default')
			.primaryPalette('blue-grey', { default: '600' })
			.accentPalette('teal', { default: '500' })
			.warnPalette('defaultPrimary')
			.backgroundPalette('grey', {
				'default': '50',
				'hue-1': '300'
			});

		$mdThemingProvider.definePalette('defaultPrimary', {
			'50': '#FFFFFF',
			'100': 'rgb(255, 198, 197)',
			'200': '#E75753',
			'300': '#E75753',
			'400': '#E75753',
			'500': '#E75753',
			'600': '#E75753',
			'700': '#E75753',
			'800': '#E75753',
			'900': '#E75753',
			'A100': '#E75753',
			'A200': '#E75753',
			'A400': '#E75753',
			'A700': '#E75753'
		});
	}]);
})();

(function() {
'use strict';
/**
 * @ngdoc directive
 * @name amfBreadcrumbs
 * @module amFramework
 *
 * @restrict E
 *
 * @description
 * `<amf-breadcrumbs>` Generates a breadcrumbs navigations showing the state hierarchy of ui.router
 *
 * @param labelProperty {string=} Property in the `data` state's property to use as dislplay string
 * for the breadcrumb. If not supplied it will default to the state's name
 * @param limitTo {integer=} Only show the last n leveles of the state hierarchy
 * @param limitToXs {integer=} Media aware level limit
 * @param limitToGtXs {integer=} Media aware level limit
 * @param limitToSm {integer=} Media aware level limit
 * @param limitToGtSm {integer=} Media aware level limit
 * @param limitToMd {integer=} Media aware level limit
 * @param limitToGtMd {integer=} Media aware level limit
 * @param limitToLg {integer=} Media aware level limit
 * @param limitToGtLg {integer=} Media aware level limit
 * @param limitToXl {integer=} Media aware level limit
 *
 */

BreadcrumbsCtrl.$inject = ['$transitions', '$state'];
angular.module('amFramework')
	.component('amfBreadcrumbs', {
		restrict: 'E',
		transclude: false,
		bindings: {
			labelProperty: '@',
			limitTo: '@',

			limitToXs: '@',
			limitToGtXs: '@',
			limitToSm: '@',
			limitToGtSm: '@',
			limitToMd: '@',
			limitToGtMd: '@',
			limitToLg: '@',
			limitToGtLg: '@',
			limitToXl: '@'
		},
		templateUrl: 'app/components/breadcrumbs.tmpl.html',
		controller: BreadcrumbsCtrl
	});

function BreadcrumbsCtrl($transitions, $state) {
    // Private data
	var self = this;
	var mediaStyles = {
		limitTo: 'hide',
		limitToXs: 'hide-xs',
		limitToGtXs: 'hide-gt-xs',
		limitToSm: 'hide-sm',
		limitToGtSm: 'hide-gt-sm',
		limitToMd: 'hide-md',
		limitToGtMd: 'hide-gt-md',
		limitToLg: 'hide-lg',
		limitToGtLg: 'hide-gt-lg',
		limitToXl: 'hide-xl'
	};

    // Public Methods & Event Handlers
	this.$onInit = $onInit;
	this.hideClass = hideClass;

    // Construction
	$transitions.onStart({}, _onTransition);

    // Implementation
	function $onInit() {
		self.dest = $state.$current;

		if (!self.labelProperty) self.labelProperty = 'name';
	}

	function hideClass(index) {
		var style = {};
		var depth = self.dest.path.length - 1 - index;

		for (var prop in mediaStyles)
			if (depth > self[prop]) style[mediaStyles[prop]] = true;

		return style;
	}

	function _onTransition(trans) {
		self.dest = trans.$to();
	}
}
})();

(function() {
'use strict';
/**
 * @ngdoc directive
 * @name amfHttpProgress
 * @module amFramework
 *
 * @restrict E
 *
 * @description
 * `<amf-http-progress>` Shows a mdProgressLinear whenever an $http call is being made
 * Style can be controlled with `amf-http-progress` class
 *
 * It registers a http interceptor that triggers the spinner on each call.
 * It also exposes a companion factory `$amfHttpProgress` that can be used to enable/disable the annimation.
 * Alternative individual $http calls can be tagged with a truthy `ignoreHttpProgress` property in the
 * request config object, so that it doesn't trigger the animation.
 *
 */

HttpProgressControler.$inject = ['$scope'];
httpProgressFactory.$inject = ['$rootScope'];
progressInterceptor.$inject = ['$rootScope', '$amfHttpProgress'];
angular.module('amFramework')
	.component('amfHttpProgress', {
		transclude: false,
		template: '<div class="amf-http-progress" style="z-index:95;"><md-progress-linear ' +
			               'class="md-hue-2" md-mode="indeterminate" ng-disabled="!$ctrl.show">' +
			           '</md-progress-linear></div>',
		controller: HttpProgressControler


	})
	.factory('$amfHttpProgress', httpProgressFactory)
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push(progressInterceptor);
	}]);

function HttpProgressControler($scope) {
	var self = this;

	self.show = false;

	self.$postLink = function postLink() {
		$scope.$on('amfHttpProgress.show', function() {
			self.show = true;
		});
		$scope.$on('amfHttpProgress.hide', function() {
			self.show = false;
		});
	};
}

function httpProgressFactory($rootScope) {
	// private vars
	var _state = {
		numPending: 0,
		enabled: true
	};

	var self = {
		enable: function() {
			_state.enabled=true;
			if (_state.numPending)
				$rootScope.$broadcast('amfHttpProgress.show');
		},
		disable: function() {
			_state.enabled=false;
			$rootScope.$broadcast('amfHttpProgress.hide');
		},
		state: function(newState) {
			var oldState = _state.enabled;
			if (typeof(newState)!='undefined') {
				if (newState)
					self.enable();
				else
					self.disable();
				return oldState;
			}
			return _state.enabled;
		},
		_state: _state
	};

	return self;
}

function progressInterceptor($rootScope, $amfHttpProgress) {
	return {
		request: function(config) {
			if ($amfHttpProgress._state.enabled && !config.ignoreHttpProgress) {
				config._httpProgress = true;
				$amfHttpProgress._state.numPending++;
				$rootScope.$broadcast('amfHttpProgress.show');
			}
			return config;
		},
		response: function(response) {
			if (response.config._httpProgress) {
				$amfHttpProgress._state.numPending--;
				if (!$amfHttpProgress._state.numPending) $rootScope.$broadcast('amfHttpProgress.hide');
			}

			return response;
		},
		responseError: function(response) {
			if (response.config._httpProgress) {
				$amfHttpProgress._state.numPending--;
				if (!$amfHttpProgress._state.numPending) $rootScope.$broadcast('amfHttpProgress.hide');
			}

			return response;
		}
	};
}
})();

(function() {
'use strict';
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
})();

(function() {
'use strict';
/**
 * @ngdoc directive
 * @name amfSideMenu
 * @module amFramework
 *
 * @restrict E
 *
 * @description
 * `<amf-side-menu>` Generates a navigation menu with unlimited nested items.
 * If it is inside a mdSidenav, it will automatically close on click.
 *
 * Style can be customized by level using the `.amf-menu-item-<level>` class. Where root items
 * have a level of `00`.
 *
 * @param nodes {!Array<Object>=} Array of nodes with menu data that have the
 *      following properties:
 *      - `title` - `{string=}`: Label to display on the menu
 *      - `sref` - `{string=}`: State to activate when clicked. Ignored if the node has children.
 *      If a node doesn't have children and sref is empty, the item will be shown as disabled.
 *      - `isOpen` - `{boolean=}`: Get/sets if a node with children is currently open.
 *      - `childs` - `{!Array<Object>=}`: Array of children nodes, with the same structure
 * @param onClick {function(!node)=} Function that is called when an item is clicked.
 * It recives the current node object as a parameter.
 *
 */
angular.module('amFramework')
	.component('amfSideMenu', {
		transclude: false,
		bindings: {
			nodes: '<',
			onClick: '&'
		},
		templateUrl: 'app/components/sideMenu.tmpl.html'
	});
})();

(function() {
'use strict';
/**
 * @ngdoc directive
 * @name amfSideMenuItem
 * @module amFramework
 *
 * @restrict E
 *
 * @description
 * `<amf-side-menu-item>` Internal directive representing a specific item of a amfSideMenu.
 * It is not intended to be used directly
 *
 * @param nodes {!Array<Object>=} Array of nodes with menu data that have the
 *      following properties:
 *      - `node` - `{!Object=}`: Object with node information
 *      - `level` - `{integer=}`: Level of the node in the tree. Root elements have `0` level
 *      and each child level increases by one. It will set a class `.amf-menu-item-<level>`
 *      that can be used to customize specific level appearence.
 *
 */
angular.module('amFramework')
	.component('amfSideMenuItem', {
		transclude: false,
		bindings: {
			level: '@',
			node: '<'
		},
		templateUrl: 'app/components/sideMenuItem.tmpl.html',
		require: {
			menu: '^^amfSideMenu',
			sidenav: '?^^mdSidenav'
		},
		controller: SideMenuItemCtrl
	});


function SideMenuItemCtrl() {
    // Private data
	var self = this;

    // Public Methods & Event Handlers
	this.click = click;

    // Construction

    // Implementation
	function click() {
		self.node.isOpen = !self.node.isOpen;
		if ((!self.node.childs || !self.node.childs.length) && self.node.sref && self.sidenav)
			self.sidenav.close();

		if (typeof self.menu.onClick == 'function')
			self.menu.onClick(this.node);
	}
}
})();

(function() {
'use strict';
/**
 * @ngdoc directive
 * @name amfSlide
 * @module amFramework
 *
 * @restrict A
 *
 * @description
 * `amf-slide` Helper directive to give the element a slide animation to show or hide
 *
 * @param amfSlide {!bool=} change it to animate and show/hide
 *
 */

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
})();

(function() {
'use strict';
/**
 * @ngdoc directive
 * @name amfToolbarButtons
 * @module amFramework
 *
 * @restrict E
 *
 * @description
 * `<amf-toolbar-buttons>` Generates a toolbar icon menu which opens popup menues with actions
 *
 * @param buttons {!Array<Object>=} Array of button definition with the following properties:
 *      - `icon` - `{string=}`: Icon to display on the menu. It must be a named SVG already loaded.
 *      - `lagel` - `{string=}`: Label to display on the menu.
 *		- `badge` - `{string=}`: Badge to display over the icon button.
 * 		- `onClick` -  `{function()=}`: Function that is called when an item is clicked.
 *      - `menu` - `{!Array<Object>=}`: Array of children nodes, with the same structure
 *
 */
angular.module('amFramework')
	.component('amfToolbarButtons', {
		replace: false,
		transclude: false,
		bindings: { buttons: '<' },
		templateUrl: 'app/components/toolbarButtons.tmpl.html'
	});
})();

(function() {
'use strict';
'use strict';

AppController.$inject = ['$mdSidenav', '$timeout'];
angular
	.module('amFramework')
	.component('amfApp', {
		templateUrl: 'app/containers/App.tmpl.html',
		controller: AppController,
		bindings: {
			sideMenu: '<',
			toolbar: '<',
			onClick: '&'
		},
		transclude: {
			title: '?amfAppTitle',
			content: '?amfAppContent',
			footer: '?amfAppFooter'
		}
	});

function AppController($mdSidenav, $timeout) {
	this.openMenu = function() {
		$timeout(function() {
			$mdSidenav('left').open();
		});
	};
}
})();

(function() {
'use strict';
/**
 * @ngdoc provider
 * @name amfLoginDialog
 * @module amFramework
 *
 * @description
 * Provides authentication services with http interceptor
 *
 *
 */


loginDialogConfig.$inject = ['$httpProvider', 'amfLoginDialogProvider'];
angular
	.module('amFramework')
	.provider('amfLoginDialog', LoginDialogProvider)
	.config(loginDialogConfig);

function LoginDialogProvider() {
	// private vars
	loginInterceptor.$inject = ['$q', '$injector', '$cookies', '$rootScope', '$amfHttpProgress'];
	loginDialogFactory.$inject = ['$injector'];
	var loggedToken = null;
	var options = {
		loginFactory: null,
		retryFilter: null,
		httpErrors: ['401'],
		jsonrpcErrors: [-32002],
		cookie: 'auth-token',
		disabled: false
	};
	var httpBuffer = [];

	// configuration interface
	this.configure = configure;
	this._loginInterceptor = loginInterceptor;

	// service factory
	this.$get = loginDialogFactory;

	// function definitions
	function configure(opts) {
		angular.extend(options, opts);

		if (angular.isObject(options.cookie)) {
			options.cookie.name = options.cookie.name || 'auth-token';
			options.cookie.path = options.cookie.path || '/';
		} else if (angular.isString(options.cookie)) {
			options.cookie = { name: options.cookie, path: '/' };
		} else
			options.cookie = null;
	}

	/* ngInject */
	function loginDialogFactory($injector) {
		if (options.loginFactory && !options.loginCB)
			options.loginCB = $injector.invoke(options.loginFactory);

		return {
			enable: function() {
				options.disabled=false;
			},
			disable: function() {
				options.disabled=true;
			}
		};
	}

	/* @ngInject */
	function loginInterceptor($q, $injector, $cookies, $rootScope, $amfHttpProgress) {
		LoginDialogController.$inject = ['$mdDialog', '$cookies', '$rootScope', '$scope'];
		var $http, $mdDialog;

		return {
			response: interceptResponse,
			responseError: interceptError
		};


		function interceptResponse(response) {
			var config = response.config || {};
			var data = angular.isArray(response.data) ? response.data : [response.data || {}];
			var deferred = $q.defer();

			if (!options.disabled && !config.ignoreAuthModule && options.jsonrpcErrors.length) {
				for (var i=0; i< data.length; i++) {
					if (data[i].error && data[i].jsonrpc === '2.0') {
						if (options.jsonrpcErrors.indexOf(data[i].error.code) >= 0) {
							config.deferred = deferred;
							httpBuffer.push(config);

							if (httpBuffer.length === 1)
								doLogin().then(retryAll, rejectAll);

							return deferred.promise;
						}
					}
				}
			}
			return response;
		}

		function interceptError(rejection) {
			var config = rejection.config || {};
			var deferred = $q.defer();

			if (!options.disabled && !config.ignoreAuthModule && options.httpErrors.length) {
				if (options.httpErrors.indexOf(rejection.status)>=0) {
					config.deferred = deferred;
					httpBuffer.push(config);

					if (httpBuffer.length === 1)
						doLogin().then(retryAll, rejectAll);


					return deferred.promise;
				}
          // otherwise, default behaviour
			}
			return $q.reject(rejection);
		}

		function retryAll() {
			$http = $http || $injector.get('$http');
			for (var i = 0; i < httpBuffer.length; ++i) {
				if (options.retryFilter) options.retryFilter(httpBuffer[i], loggedToken);
				$http(httpBuffer[i]).then(function(res) {
					res.config.deferred.resolve(res);
				}, function(rej) {
					rej.config.deferred.reject(rej);
				});
			}
			httpBuffer = [];
		}

		function rejectAll(reason) {
			for (var i = 0; i < httpBuffer.length; ++i) {
				httpBuffer[i].deferred.reject(reason);
			}
			httpBuffer = [];
		}

		function doLogin() {
			var deferred = $q.defer();

			if (options.loginFactory && !options.loginCB)
				options.loginCB = $injector.invoke(options.loginFactory);

			// if there is no CB assume we are authorized
			if ( typeof(options.loginCB) != 'function')
				deferred.resolve(true);

			// if this is the first time, try with cookie token
			else if (!loggedToken && options.cookie &&
				(loggedToken = $cookies.getObject(options.cookie.name))) {
				options.loginCB(loggedToken)
					.then(function(token) {
						loggedToken = token;

						if (options.cookie) {
							$cookies.putObject(options.cookie.name, token, { path: options.cookie.path });
						}
						$rootScope.$broadcast('session.setup', token);
						deferred.resolve(token);
					}, function(errMsg) {
						if (options.cookie)
							$cookies.remove(options.cookie.name, { path: options.cookie.path });
						deferred.resolve(showLoginDialog());
					});
			} else
				deferred.resolve(showLoginDialog());

			return deferred.promise;
		}

		function showLoginDialog() {
			$mdDialog = $mdDialog || $injector.get('$mdDialog');

			var oldState = $amfHttpProgress.state(false);

			return $mdDialog.show({
				templateUrl: 'app/services/loginDialog.tmpl.html',
				controller: LoginDialogController,
				controllerAs: 'dialog',
				bindToController: true,
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true
			}).finally(function() {
				$amfHttpProgress.state(oldState);
			});
		}

		/* ngInject */
		function LoginDialogController($mdDialog, $cookies, $rootScope, $scope) {
			var dialog = this;
			$scope.theme = 'default';
			dialog.username = '';
			dialog.password = '';
			dialog.error = null;

			dialog.handleSubmit = handleSubmit;
			dialog.handleCancel = handleCancel;

			function handleSubmit() {
				if (typeof(options.loginCB) == 'function') {
					options.loginCB(dialog.username, dialog.password)
						.then(function(token) {
							loggedToken = token;
							dialog.password = '';
							dialog.username = '';
							$mdDialog.hide(token);
							dialog.error = null;

							if (options.cookie) {
								$cookies.putObject(options.cookie.name, token, { path: options.cookie.path });
							}
							$rootScope.$broadcast('session.setup', token);
						}, function(errMsg) {
							if (options.cookie)
								$cookies.remove(options.cookie.name, { path: options.cookie.path });
							dialog.error = { unauthorized: errMsg || 'Invalid username/password' };
						});
				} else $mdDialog.hide();
				return;
			}

			function handleCancel() {
				return $mdDialog.cancel();
			}
		}
	}
}

/* ngInject */
function loginDialogConfig($httpProvider, amfLoginDialogProvider) {
	// initialization
	$httpProvider.interceptors.push(amfLoginDialogProvider._loginInterceptor);
}


})();

angular.module('amFramework').run(['$templateCache', function($templateCache) {$templateCache.put('app/components/breadcrumbs.tmpl.html','<header class="amf-breadcrumbs"><span ng-repeat="state in $ctrl.dest.path | limitTo:-$ctrl.dest.path.length+1" ng-class="$ctrl.hideClass($index)"><a ng-if="state.abstract || $last">{{$eval(\'state.\' + $ctrl.labelProperty) || state.name}}</a> <a ng-if="!(state.abstract || $last)" ui-sref="{{state.name}}">{{$eval(\'state.\' + $ctrl.labelProperty) || state.name}}</a><md-icon md-svg-src="chevron-right" ng-if="!$last"></span></header>');
$templateCache.put('app/components/panel.tmpl.html','<section layout-margin class="md-whiteframe-z1 amf-panel" md-colors="{\'background-color\': \'background\'}"><md-toolbar class="md-hue-1 amf-panel-toolbar"><div class="md-toolbar-tools"><md-icon md-svg-icon="{{icon}}"></md-icon><h3 class="amf-panel-tittle">{{title}}</h3><span flex></span><md-button ng-show="options" ng-click="$showOptions = !$showOptions" class="md-icon-button" aria-label="Show options"><md-icon md-svg-icon="dots-vertical"></md-icon></md-button></div></md-toolbar><md-content><ng-transclude></ng-transclude></md-content></section>');
$templateCache.put('app/components/sideMenu.tmpl.html','<md-content flex role="navigation" md-colors="{\'background-color\': \'background\'}"><ul ng-if="$ctrl.nodes.length"><li ng-repeat="node in $ctrl.nodes"><amf-side-menu-item node="node" level="0"></li></ul></md-content>');
$templateCache.put('app/components/sideMenuItem.tmpl.html','<md-button ng-if="$ctrl.node.childs && $ctrl.node.childs.length" ng-click="$ctrl.click();" ng-class="\'amf-menu-item-\' + $ctrl.level" class="amf-button-toggle"><div flex="grow" layout="row"><span>{{$ctrl.node.title}}</span> <span flex></span> <span ng-class="{\'toggled\' : $ctrl.node.isOpen}" ng-if="$ctrl.node.childs" class="amf-toggle-icon"><md-icon md-svg-icon="chevron-down"></md-icon></span></div></md-button><md-button ng-if="(!$ctrl.node.childs || !$ctrl.node.childs.length) && $ctrl.node.sref" ng-click="$ctrl.click();" ui-sref-active="md-accent active" ng-class="\'amf-menu-item-\' + $ctrl.level" class="amf-button-link" ui-sref="{{$ctrl.node.sref}}"><div flex="grow" layout="row"><span>{{$ctrl.node.title}}</span></div></md-button><md-button ng-if="(!$ctrl.node.childs || !$ctrl.node.childs.length) && !$ctrl.node.sref" ng-click="$ctrl.click();" ng-class="\'amf-menu-item-\' + $ctrl.level" class="amf-button-disabled" ng-disabled="true"><div flex="grow" layout="row"><span>{{$ctrl.node.title}}</span></div></md-button><md-divider></md-divider><div amf-slide="$ctrl.node.isOpen"><ul ng-if="$ctrl.node.childs.length" class="amf-menu-children"><li ng-repeat="child in $ctrl.node.childs"><amf-side-menu-item node="child" level="{{$ctrl.level + 1}}"></li></ul></div>');
$templateCache.put('app/components/toolbarButtons.tmpl.html','<section layout="row" layout-align="end"><div ng-repeat="btn in $ctrl.buttons" style="position:relative"><ng-bind-html ng-if="btn.template" ng-bind-html="btn.template"></ng-bind-html><md-button ng-if="!btn.template && !btn.menu" ng-click="btn.onClick && btn.onClick();" class="md-icon-button toolbar-button" aria-label="{{btn.label}}"><md-icon ng-if="btn.icon" md-svg-icon="{{btn.icon}}"></md-icon></md-button><span ng-if="!btn.template && btn.badge" class="amf-notifications-label">{{btn.badge}}</span><md-menu ng-if="!btn.template && btn.menu"><md-button class="md-icon-button" ng-click="$mdMenu.open($event)" aria-label="{{btn.label}}"><md-icon ng-if="btn.icon" md-svg-icon="{{btn.icon}}"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat="item in btn.menu"><md-button ng-click="$mdMenu.close(); item.onClick && item.onClick();" class="md-button" aria-label="{{item.label}}"><md-icon ng-if="item.icon" md-svg-icon="{{item.icon}}"></md-icon><span ng-if="item.label">{{item.label}}</span></md-button><span ng-if="item.badge" class="amf-notifications-label">{{item.badge}}</span></md-menu-item></md-menu-content></md-menu></div></section>');
$templateCache.put('app/containers/App.tmpl.html','<div layout="row" layout-fill><md-sidenav md-is-locked-open="$mdMedia(\'gt-sm\')" md-component-id="left" class="md-whiteframe-z2 md-sidenav-left" md-colors="{\'background-color\': \'background\'}"><header class="md-whiteframe-2dp" md-colors="{color: \'primary\'}"><ng-transclude ng-transclude-slot="title" flex="100"></ng-transclude><md-divider></md-divider></header><amf-side-menu nodes="$ctrl.sideMenu"></md-sidenav><div layout="column" flex><md-toolbar layout="row" layout-align="start center" class="md-whiteframe-2dp"><md-button class="md-icon-button" hide-gt-sm ng-click="$ctrl.openMenu()" aria-label="menu"><md-icon md-svg-icon="menu"></md-icon></md-button><amf-breadcrumbs limit-to="2" limit-to-xs="1" label-property="data.title"></amf-breadcrumbs><span flex></span><amf-toolbar-buttons buttons="$ctrl.toolbar"></amf-toolbar-buttons></md-toolbar><!-- main content --><md-content class="md-padding page-content" md-colors="{\'background-color\': \'background-hue-1\'}" md-scroll-y layout="column" flex><ng-transclude ng-transclude-slot="content"></ng-transclude><div layout="row" layout-align="center end"><ng-transclude ng-transclude-slot="footer" flex="100"></ng-transclude></div></md-content></div></div>');
$templateCache.put('app/services/loginDialog.tmpl.html','<md-dialog aria-label="Login" class="amf-login-dialog"><form name="loginForm" data-ng-submit="dialog.handleSubmit()" novalidate><div class="amf-login-dialog-header"><md-icon md-svg-icon="account-circle" class="md-accent"></md-icon><h2 md-colors="{color: \'primary\'}">Login</h2></div><md-dialog-content class="md-dialog-content" role="document" tabindex="-1" layout="column"><md-input-container><label>Username:</label><input name="username" ng-model="dialog.username" required md-autofocus></md-input-container><md-input-container md-is-error="(loginForm.password.$error && loginForm.password.$touched) || dialog.error"><label>Password:</label><input name="password" ng-model="dialog.password" type="password" required><div ng-messages="dialog.error"><div ng-message="unauthorized">{{dialog.error.unauthorized}}</div></div></md-input-container></md-dialog-content><md-dialog-actions layout="row"><span flex></span><md-button type="submit" class="md-primary md-confirm-button" aria-label="login">Login</md-button></md-dialog-actions></form></md-dialog>');}]);
//# sourceMappingURL=../.maps/amFramework.js.map
