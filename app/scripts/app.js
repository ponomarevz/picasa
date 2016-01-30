'use strict';

	angular.module('App', ['ui.router', 'ngAnimate', 'ngStorage', 'dc.endlessScroll', 'angularFileUpload']);
	
		angular.module('App').
		config(function($stateProvider) {
		
			
		$stateProvider
		.state('about', {
				url:'/about',
				views: {
					'centrV@' : {
						templateUrl:'views/about.html',
					},
				},
			})
			.state('comunity', {
				url:'/comunity',
				views: {
					'centrV@' : {
						templateUrl:'views/comunity.html',
						controller:'userComunityCtrl',
						controllerAs:'userAlbums'
					},
				},
				resolve: {
					userAlbums: function(userAlbumsService, $stateParams) {
						
						var autorId = $stateParams.autorId;
												
						userAlbumsService.setStart(1);	//--------при переходе начинаем с первой странички
						return userAlbumsService.getAlbumsCom().then(function(res){
							return res;
						});
					}
				}
			})
			.state('albums', {
				url:'/albums/:autorId',
				views: {
					'centrV@' : {
						templateUrl:'views/userAlbums.html',
						controller:'userAlbumsCtrl',
						controllerAs:'userAlbums'
					},
				},
				resolve: {
					userAlbums: function(userAlbumsService, $stateParams) {
						
						var autorId = $stateParams.autorId;
												
						userAlbumsService.setStart(1);	//--------при переходе начинаем с первой странички
						return userAlbumsService.getAlbums(autorId).then(function(res){
							return res;
						});
					}
				}
			})
			.state('albums.add', {
				url:'/add',
				views: {
					//----------------вложенній view add в состоянии albums 
					'panel@albums' : {
						templateUrl:'views/addalbum.html',
						controller:'addAlbumCtrl',
						controllerAs:'addAlbum'
					},
				}
			})
			.state('album', {
				url:'/album/:autorId/:albumId',
				views: {
					'centrV@' : {
						templateUrl:'views/album.html',
						controller:'albumCtrl',
						controllerAs:'album'
					},
				},
				resolve: {
					userAlbum: function(albumService, $stateParams) {
						
						var autorId = $stateParams.autorId;
						var albumId = $stateParams.albumId;
						
						albumService.setStart(1);				
						return albumService.getAlbum(autorId, albumId).then(function(res){
							return res;
						});
						
					}
				}
			})
			.state('photo', {
				url:'/photo/:userId/:albumId/:photoId',
				views: {
					'centrV@' : {
						templateUrl:'views/photo.html',
						controller:'userPhotoCtrl',
						controllerAs:'photo'
					},
				},
				resolve: {
					userPhoto: function(userPhotoService, $stateParams) {
						
						var userId = $stateParams.userId;
						var albumId = $stateParams.albumId;
						var photoId = $stateParams.photoId;
						
						return userPhotoService.getPhoto(userId, albumId, photoId).then(function(res){
							return res;
						});
						
					}
				}
			});
			
	})
	.config(function($urlRouterProvider, $httpProvider){
		 
		$urlRouterProvider.when('', '/comunity').
			rule(function ($injector, $location) {
				//------------ловим ответ от google---------------
				var path = $location.path().substring(1);
				var params = [];
					params = path.split('&');
					var tokenInfo = {};
					for (var i in params) {
						var pars = params[i].split('=');
						tokenInfo[pars[0]] = pars[1];
					}
					
					if (tokenInfo.access_token) {
						
						/* ----------------инжектируем сервисы на стадии конфига приложения можна свои а можна HTTP устранение циклических связей
						пользовательский сервис не может біть подключен на єтапе конфига приложения посколу он еще не существует, кроме того сервис 
						http тоже неможет біть подключен возможні циклические ссілки но их можна инжектирловать (создать новій екземпляр)
						-------------------------------------------------------------------------------------------------------------------------*/
						return $injector.get('autorService').validation(tokenInfo);
					}
					
			});
		//------ если токен существует добавляем к запросу текен если отве 401 или 403 или 500 делаем редирект--------
		//----------------------------- таким образом обрабатываем каждый запрос к серверу--------------------
		$httpProvider.interceptors.push('myIntercept');
		
	});
	angular.module('App').factory('myIntercept', function($q, $injector) {
		
		var responseInterceptor = {
			response: function(response) {
						
				if (response.data.status) {
						if (response.data.status.http_code === 403) {
							$injector.get('autorService').LogIn();
						}
					}		
			
                    return response; //асинхронная операция вернула ошибку
          }
		};
 		return responseInterceptor;
	});
	