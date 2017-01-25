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


angular
	.module('amFramework')
	.provider('amfLoginDialog', LoginDialogProvider)
	.config(loginDialogConfig)
	.run();

function LoginDialogProvider() {
	// private vars
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
	this._loginInterceptor = loginInterceptor;

	// service factory
	this.$get = loginDialogFactory;

	function configure(opts) {
		angular.extend(options, opts);
	}

	function loginDialogFactory() {
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
	function loginInterceptor($q, $injector) {
		var $http, $mdDialog;

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
			$http = $http || $injector.get('$http');
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
			$mdDialog = $mdDialog || $injector.get('$mdDialog');
			return $mdDialog.show({
				templateUrl: 'app/services/loginDialog.tmpl.html',
				controllerAs: 'dialog',
				bindToController: true,
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true

			});
		}
	}
}


function loginDialogConfig($httpProvider, amfLoginDialogProvider) {
	// initialization
	$httpProvider.interceptors.push(amfLoginDialogProvider._loginInterceptor);
}
