'use strict';

angular.module('App').
		controller('userComunityCtrl', function (userAlbums, userAlbumsService, $scope, $stateParams) {
			
			var vm = this;
			
			vm.albums = userAlbums.entry;
						
			  // Регестрируем обработчик скрола, очень простой но рабочий пагинатор
			  $scope.$on('endlessScroll:next', function() {
					
					userAlbumsService.getAlbumsCom().then(function(res){
							[].push.apply(vm.albums, res.entry);
						
						});
			});
			
			$scope.$on('$routeChangeSuccess', function () {
				alert();
				window.scrollTo(0, 0);
			});
			
		
		});