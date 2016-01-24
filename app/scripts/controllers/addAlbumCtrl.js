'use strict';

angular.module('App').
		controller('addAlbumCtrl', function (userAlbumsService, $stateParams, $localStorage) {
			
			var vm = this;
			
			
			
			vm.addAlbum = function(albumform, al) {
				var autorId = $stateParams.autorId;
				if(albumform.$valid){
					userAlbumsService.addAlbum(autorId, al);
				}
			};
			
			vm.access = [
				{title: "Публичный" , zn: 'public' },
				{title: "Приватный" , zn: 'protected' }
			];
						
		
		});
		