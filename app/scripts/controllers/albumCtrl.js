'use strict';

angular.module('App').
		controller('albumCtrl', function (userAlbum, $scope, albumService, $stateParams, $localStorage) {
			
			var vm = this;
			//----------------фотографии в альбоме-----------
			vm.photos = userAlbum.entry;
			vm.album = userAlbum;
			
			vm.isAddButton = function() {
				
				var autorId = $stateParams.autorId;
				
				return autorId === $localStorage.userId ? true : false;
			};
					
			
			  // Регестрируем обработчик скрола, очень простой но рабочий пагинатор
			$scope.$on('endlessScroll:next', function() {
					var autorId = $stateParams.autorId;
					var albumId = $stateParams.albumId;	
					
					albumService.getAlbum(autorId, albumId).then(function(res){
							[].push.apply(vm.photos, res.entry);
						});
			});
			
			
		});