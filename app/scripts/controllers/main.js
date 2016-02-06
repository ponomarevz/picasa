'use strict';

angular.module('App').
		controller('main', function ($localStorage, autorService, $scope) {
			
			var vm = this;
									
			vm.isAuthenticated	= function() {
				vm.user = $localStorage.user;
				vm.token = $localStorage.token;
				return vm.token ? true : false;
			};
			
			//--------------------------логинимся через google--------------------
			vm.login = function() {
				autorService.LogIn();
			};
			
			
			vm.logout = function() {
				autorService.LogOut();
			};
			
					
			//------------------------------индикация загрузки странички
			vm.showSnip = false;
			$scope.$on('ajaxStart', function() {
				
				vm.showSnip = true;
			});
			$scope.$on('ajaxStop', function() {
				
				vm.showSnip = false;
			});
			$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				if (toState.resolve) {
					vm.showSnip = true;
				}
			});
			
			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				if (toState.resolve) {
					vm.showSnip = false;
				}
			});
			
		});

