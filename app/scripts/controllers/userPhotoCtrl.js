'use strict';

angular.module('App').
		controller('userPhotoCtrl', function (userPhoto, $stateParams) {
			
			var vm = this;
			//----------------фотографии в альбоме-----------
			vm.photo = userPhoto;
					
			
		});