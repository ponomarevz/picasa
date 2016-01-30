'use strict';

angular.module('App').
		controller('main', function ($localStorage, autorService) {
			
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
			
		});

