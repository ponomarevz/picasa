'use strict';

angular.module('App').
		controller('addAlbumCtrl', function (userAlbumsService, $stateParams, $state,
											$localStorage, FileUploader, $scope) {
			
			var vm = this;
			vm.albumId = null;
			vm.img = null; // -------------сделать на очередь пока тестим
			
			var uploader = $scope.uploader = new FileUploader({
            url: 'http://etest.optimus-it.biz/upload.php'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
			//uploader.queue.file.name
			vm.img = uploader.queue[0].file.name;
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
				
				
			  
			vm.addAlbum = function(albumform, al) {
				var autorId = $stateParams.autorId;
				if(albumform.$valid){
					userAlbumsService.addAlbum(autorId, al).then(function(res){
						vm.albumId = res.id_al;
						//alert(JSON.stringify(res.data));
						$state.go("albums");
						//----------------емитируем собітие вверх
						$scope.$emit('albums-update');
					});
					
				}
			};
			
			vm.addPhoto = function(albumform, al) {
				var autorId = $stateParams.autorId;
					if (vm.albumId && vm.img) { //проверка альбом создан, файл загружен будем сохранять на google
							
					  userAlbumsService.addPhoto(autorId, vm.albumId, vm.img);
					}
			};
			
			vm.access = [
				{title: "Публичный" , zn: 'public' },
				{title: "Защищенный" , zn: 'protected' },
				{title: "Приватный" , zn: 'private' }
			];
						
		
		})
		.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);

		