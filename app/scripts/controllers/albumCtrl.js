'use strict';

angular.module('App').
		controller('albumCtrl', function (userAlbum, albumService, $stateParams) {
			
			var vm = this;
			//----------------фотографии в альбоме-----------
			vm.photos = userAlbum.entry;
			vm.album = userAlbum;
					alert(JSON.stringify(vm.photos));
			
			
			
			
		});