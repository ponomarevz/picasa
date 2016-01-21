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
				var client_id='394850313404-35e3blaofgnk97j0618h900p0fr0ammf.apps.googleusercontent.com';
				var scope='email http://picasaweb.google.com/data'; // --- такой токен
				var redirect_uri='http://localhost:9000';
				var response_type='token';
				
				
				var url="https://accounts.google.com/o/oauth2/auth?scope=" + scope 
					+ '&client_id=' + client_id 
					+ '&redirect_uri=' + redirect_uri 
					+ '&response_type=' + response_type;
					
				window.location.replace(url);
			};
			
			
			vm.logout = function() {
				autorService.LogOut();
			};
			
		});

