(function() {
'use strict';
'use strict';

angular
	.module('amFramework', ['ngMaterial', 'ngAnimate', 'ui.router'])
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

		$mdThemingProvider.theme('dark', 'default')
			.primaryPalette('defaultPrimary')
			.dark();

		$mdThemingProvider.theme('grey', 'default')
			.primaryPalette('grey');

		$mdThemingProvider.theme('custom', 'default')
			.primaryPalette('defaultPrimary', { 'hue-1': '50' });

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

BreadcrumbsCtrl.$inject = ['$transitions'];
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

function BreadcrumbsCtrl($transitions) {
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
		if (!self.labelProperty) self.labelProperty = 'name';
	}

	function hideClass(index) {
		var style = {};
		var depth = self.depth - index;

		for (var prop in mediaStyles)
			if (depth > self[prop]) style[mediaStyles[prop]] = true;

		return style;
	}

	function _onTransition(trans) {
		self.dest = trans.$to();
		self.depth = self.dest.path.length - 1;
	}
}
})();

(function() {
'use strict';
angular.module('amFramework')
	.controller('LoginDialogController', ControllerFunction);


    // ----- ControllerFunction -----
ControllerFunction.$inject = ['$mdDialog'];

    /* @ngInject */
function ControllerFunction($mdDialog) {
	var vm = this;
	vm.username = null;
	vm.password = null;

	vm.handleSubmit = handleSubmit;
	vm.handleCancel = handleCancel;

	function handleSubmit() {
		return $mdDialog.hide();
	}

	function handleCancel() {
		return $mdDialog.hide();
	}
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
 * `<amf-side-menu>` Generates a navigation menu inside a mdSidenav, with unlimited nested items.
 *
 * Style can be customized by level using the `.amf-menu-item-<level>` class. Where root items
 * have a level of `00`.
 *
 * @param nodes {!Array<Object>=} Array of nodes with menu data that have the
 *      following properties:
 *      - `name` - `{string=}`: Label to display on the menu
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
			sidenav: '^^mdSidenav'
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
		if ((!self.node.childs || !self.node.childs.length) && self.node.sref)
			self.sidenav.close();

		if (typeof self.menu.onClick == 'function')
			self.menu.onClick(this.node);
	}
}
})();

(function() {
'use strict';
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
		controllerAs: 'ac',
		transclude: {
			title: '?amfAppTitle',
			content: '?amfAppContent',
			footer: '?amfAppFooter'
		}
	});

function AppController($mdSidenav, $timeout) {
	this.menu = {};
	this.menu.currentPage = { name: 'Dashboard' };
	this.menu.currentSection = { name: 'Status' };

	this.openMenu = function() {
		$timeout(function() {
			$mdSidenav('left').open();
		});
	};
	this.closeMenu = function(node) {
		if ((node && !node.childs && node.sref) || !node)
			$timeout(function() {
				$mdSidenav('left').open();
			});
	};

	this.menuItems = [
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
	this.buttons = [
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
 * Provides authentication services
 *
 *
 */


LoginDialogProvider.$inject = ['$httpProvider'];
loginDialogConfig.$inject = ['$httpProvider'];
angular
	.module('amFramework')
	.provider('amfLoginDialog', LoginDialogProvider)
	.config(loginDialogConfig)
	.run();

function LoginDialogProvider($httpProvider) {
	// private vars
	loginInterceptor.$inject = ['$mdDialog', '$cookies', '$q', '$http'];
	loginDialogFactory.$inject = ['$mdDialog'];
	var username = null;
	var session = null;
	var options = {
		loginCB: null,
		httpErrors: ['401'],
		jsonrpcErrors: [-32002],
		cookie: 'sessionid'
	};
	var httpBuffer = [];

	// configuration interface
	this.configure = configure;

	// service factory
	this.$get = loginDialogFactory;


	// initialization
	$httpProvider.interceptors.push(loginInterceptor);


	function configure(opts) {
		angular.extend(options, opts);
	}

	function loginDialogFactory($mdDialog) {
		return {
			getUser: function() {
				return username;
			},
			getSession: function() {
				return session;
			}
		};
	}

	/* @ngInject */
	function loginInterceptor($mdDialog, $cookies, $q, $http) {
		return {
			response: interceptResponse,
			responseError: interceptError
		};


		function interceptResponse(response) {
			var config = response.config || {};
			var data = response.data || {};
			var deferred = $q.defer();
			if (!config.ignoreAuthModule && options.jsonrpcErrors.length &&
			    data.error && data.jsonrpc === '2.0') {
				if (options.jsonrpcErrors.indexOf(data.error)>=0) {
					httpBuffer.push({
						config: config,
						deferred: deferred
					});

					if (httpBuffer.length === 1)
						showLoginDialog().then(retryAll, rejectAll);

					return deferred.promise;
				}
			}
			return response;
		}

		function interceptError(rejection) {
			var config = rejection.config || {};
			var deferred = $q.defer();
			if (!config.ignoreAuthModule && options.httpErrors.length) {
				if (options.httpErrors.indexOf(rejection.status)>=0) {
					httpBuffer.push({
						config: config,
						deferred: deferred
					});

					if (httpBuffer.length === 1)
						showLoginDialog().then(retryAll, rejectAll);


					return deferred.promise;
				}
          // otherwise, default behaviour
			}
			return $q.reject(rejection);
		}

		function retryAll() {
			for (var i = 0; i < httpBuffer.length; ++i) {
				$http(httpBuffer[i].config).then(function(res) {
					httpBuffer[i].deferred.resolve(res);
				}, function(rej) {
					httpBuffer[i].deferred.reject(rej);
				});
			}
			httpBuffer = [];
		}

		function rejectAll(reason) {
			for (var i = 0; i < httpBuffer.length; ++i) {
				httpBuffer.deferred.reject(reason);
			}
			httpBuffer = [];
		}

		function showLoginDialog() {
			return $mdDialog.show({
				templateUrl: 'services/loginDialog.tmpl.html',
				controllerAs: 'dialog',
				      bindToController: true,
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true

			});
		}
	}
}


function loginDialogConfig($httpProvider) {

}
})();

angular.module('amFramework').run(['$templateCache', function($templateCache) {$templateCache.put('app/components/breadcrumbs.tmpl.html','<header class="amf-breadcrumbs"><span ng-repeat="state in $ctrl.dest.path | limitTo:-$ctrl.dest.path.length+1" ng-class="$ctrl.hideClass($index)"><a ng-if="state.abstract || $last">{{$eval(\'state.\' + $ctrl.labelProperty) || state.name}}</a> <a ng-if="!(state.abstract || $last)" ui-sref="{{state.name}}">{{$eval(\'state.\' + $ctrl.labelProperty) || state.name}}</a><md-icon md-svg-src="chevron-right" ng-if="!$last"></span></header>');
$templateCache.put('app/components/loginDialog.tmpl.html','<md-dialog aria-label="Login" class="amf-login-dialog"><form name="loginForm" data-ng-submit="vm.handleSubmit()"><md-toolbar><div class="md-toolbar-tools"><h2>Login</h2></div></md-toolbar><md-dialog-content class="md-dialog-content" role="document" tabindex="-1"><md-input-container class="" md-no-float><label>Username:</label><input name="username" ng-model="vm.username" required md-autofocus><div ng-messages="loginForm.username.$error"><div ng-message="required">This is required!</div></div></md-input-container><md-input-container class="md-block"><label>Password:</label><input ng-model="vm.password" type="password" required></md-input-container></md-dialog-content><md-dialog-actions layout="row"><span flex></span><md-button type="submit" class="md-primary md-confirm-button" aria-label="login">Login</md-button></md-dialog-actions></form></md-dialog><md-dialog aria-label="Login" class="amf-login-dialog"><md-dialog-content class="md-dialog-content" role="document" tabindex="-1"><h2 class="md-title">Login</h2><div ng-if="::dialog.mdHtmlContent" class="md-dialog-content-body" ng-bind-html="::dialog.mdHtmlContent"></div><div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body"><p>{{::dialog.mdTextContent}}</p></div><md-input-container md-no-float ng-if="::dialog.$type == \\prompt\\" class="md-prompt-input-container"><input ng-keypress="dialog.keypress($event)" md-autofocus ng-model="dialog.result" placeholder="{{::dialog.placeholder}}"></md-input-container></md-dialog-content><md-dialog-actions><md-button ng-if="dialog.$type === \\confirm\\ || dialog.$type === \\prompt\\" ng-click="dialog.abort()" class="md-primary md-cancel-button">{{ dialog.cancel }}</md-button><md-button ng-click="dialog.hide()" class="md-primary md-confirm-button" md-autofocus="dialog.$type===\\alert\\">{{ dialog.ok }}</md-button></md-dialog-actions></md-dialog>');
$templateCache.put('app/components/panel.tmpl.html','<section layout-margin class="md-whiteframe-z1 amf-panel" md-colors="{\'background-color\': \'background\'}"><md-toolbar class="md-hue-1 amf-panel-toolbar"><div class="md-toolbar-tools"><md-icon md-svg-icon="{{icon}}"></md-icon><h3 class="amf-panel-tittle">{{title}}</h3><span flex></span><md-button ng-show="options" ng-click="$showOptions = !$showOptions" class="md-icon-button" aria-label="Show options"><md-icon md-svg-icon="dots-vertical"></md-icon></md-button></div></md-toolbar><md-content><ng-transclude></ng-transclude></md-content></section>');
$templateCache.put('app/components/sideMenu.tmpl.html','<md-content flex role="navigation" md-colors="{\'background-color\': \'background\'}"><ul ng-if="$ctrl.nodes.length"><li ng-repeat="node in $ctrl.nodes"><amf-side-menu-item node="node" level="0"></li></ul></md-content>');
$templateCache.put('app/components/sideMenuItem.tmpl.html','<md-button ng-if="$ctrl.node.childs && $ctrl.node.childs.length" ng-click="$ctrl.click();" ng-class="\'amf-menu-item-\' + $ctrl.level" class="amf-button-toggle"><div flex="grow" layout="row"><span>{{$ctrl.node.name}}</span> <span flex></span> <span ng-class="{\'toggled\' : $ctrl.node.isOpen}" ng-if="$ctrl.node.childs" class="amf-toggle-icon"><md-icon md-svg-icon="chevron-down"></md-icon></span></div></md-button><md-button ng-if="(!$ctrl.node.childs || !$ctrl.node.childs.length) && $ctrl.node.sref" ng-click="$ctrl.click();" ui-sref-active="md-accent active" ng-class="\'amf-menu-item-\' + $ctrl.level" class="amf-button-link" ui-sref="{{$ctrl.node.sref}}"><div flex="grow" layout="row"><span>{{$ctrl.node.name}}</span></div></md-button><md-button ng-if="(!$ctrl.node.childs || !$ctrl.node.childs.length) && !$ctrl.node.sref" ng-click="$ctrl.click();" ng-class="\'amf-menu-item-\' + $ctrl.level" class="amf-button-disabled" ng-disabled="true"><div flex="grow" layout="row"><span>{{$ctrl.node.name}}</span></div></md-button><md-divider></md-divider><div amf-slide="$ctrl.node.isOpen"><ul ng-if="$ctrl.node.childs.length" class="amf-menu-children"><li ng-repeat="child in $ctrl.node.childs"><amf-side-menu-item node="child" level="{{$ctrl.level + 1}}"></li></ul></div>');
$templateCache.put('app/components/toolbarButtons.tmpl.html','<section layout="row" layout-align="end"><div ng-repeat="btn in $ctrl.buttons" style="position:relative"><ng-bind-html ng-if="btn.template" ng-bind-html="btn.template"></ng-bind-html><md-button ng-if="!btn.template && !btn.menu" class="md-icon-button toolbar-button" aria-label="{{btn.name}}"><md-icon ng-if="btn.icon" md-svg-icon="{{btn.icon}}"></md-icon></md-button><span ng-if="btn.notifLabel" class="amf-notifications-label">{{btn.notifLabel}}</span><md-menu ng-if="!btn.template && btn.menu"><md-button class="md-icon-button" ng-click="$mdOpenMenu($event)" aria-label="{{btn.name}}"><md-icon ng-if="btn.icon" md-svg-icon="{{btn.icon}}"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat="item in btn.menu"><md-button ng-click="$mdCloseMenu()" class="md-button" aria-label="{{item.name}}"><md-icon ng-if="item.icon" md-svg-icon="{{item.icon}}"></md-icon><span ng-if="item.label">{{item.label}}</span></md-button></md-menu-item></md-menu-content></md-menu></div></section>');
$templateCache.put('app/containers/App.tmpl.html','<div layout="row" layout-fill><md-sidenav md-is-locked-open="$mdMedia(\'gt-sm\')" md-component-id="left" class="md-whiteframe-z2 md-sidenav-left" md-colors="{\'background-color\': \'background\'}"><header class="md-whiteframe-2dp" md-colors="{color: \'primary\'}"><ng-transclude ng-transclude-slot="title" flex="100"></ng-transclude><md-divider></md-divider></header><amf-side-menu nodes="ac.menuItems"></md-sidenav><div layout="column" flex><md-toolbar layout="row" layout-align="start center" class="md-whiteframe-2dp"><md-button class="md-icon-button" hide-gt-sm ng-click="ac.openMenu()" aria-label="menu"><md-icon md-svg-icon="menu"></md-icon></md-button><amf-breadcrumbs limit-to="2" limit-to-xs="1" label-property="data.title"></amf-breadcrumbs><span flex></span><amf-toolbar-buttons buttons="ac.buttons"></amf-toolbar-buttons></md-toolbar><!-- main content --><div><md-progress-linear class="md-accent" md-mode="buffer" value="10" md-buffer-value="10"></md-progress-linear></div><md-content class="md-padding page-content" md-colors="{\'background-color\': \'background-hue-1\'}" md-scroll-y layout="column" flex><ng-transclude ng-transclude-slot="content"></ng-transclude><div layout="row" layout-align="center end"><ng-transclude ng-transclude-slot="footer" flex="100"></ng-transclude></div></md-content></div></div>');}]);
//# sourceMappingURL=../.maps/amFramework.js.map
