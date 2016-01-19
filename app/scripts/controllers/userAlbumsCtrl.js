'use strict';

angular.module('App').
		controller('userAlbumsCtrl', function (userAlbums, userAlbumsService, $scope, $stateParams) {
			
			var vm = this;
			
			vm.albums = userAlbums.entry;
			vm.author = userAlbums;
			var autorId = $stateParams.autorId;
			
			vm.addAlbum = function() {
				userAlbumsService.addAlbum(autorId);
			}
			
			  // Регестрируем обработчик скрола, очень простой но рабочий пагинатор
			  $scope.$on('endlessScroll:next', function() {
					
					userAlbumsService.getAlbums(autorId).then(function(res){
							[].push.apply(vm.albums, res.entry);
						});
			});
			
		
		});
		