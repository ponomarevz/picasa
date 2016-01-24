'use strict';

angular.module('App').
		controller('userAlbumsCtrl', function (userAlbums, userAlbumsService, $scope, $stateParams, $localStorage) {
			
			var vm = this;
			
			vm.albums = userAlbums.entry;
			vm.author = userAlbums;
			var autorId = $stateParams.autorId;
			
			vm.addAlbum = function() {
				userAlbumsService.addAlbum(autorId);
			};
			
			vm.isAddButton = function() {
				
				var autorId = $stateParams.autorId;
				
				return autorId === $localStorage.userId ? true : false;
			};
			
			vm.openAutor = function(user, $event) {
			
				window.location = 'http://etest.optimus-it.biz/#/albums/' + user;
				$event.stopPropagation();
				
			}
			
			  // Регестрируем обработчик скрола, очень простой но рабочий пагинатор
			  $scope.$on('endlessScroll:next', function() {
					
					userAlbumsService.getAlbums(autorId).then(function(res){
							[].push.apply(vm.albums, res.entry);
						});
			});
			
		
		});
		