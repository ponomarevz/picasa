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
		$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage,  $httpParamSerializerJQLike, $injector) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    config.headers['GData-Version'] = 2;
					
					
					if ($localStorage.tokenInfo) {
						//--------------------не получилось с пикаса апи нужно через сервер------------
						//config.headers.Authorization = $localStorage.tokenInfo.token_type 
						//								+ ' ' + $localStorage.tokenInfo.access_token;
						
					}
					
                    return config;
                },
				'response': function(res) {
					//------------------перехватіваю все ответі с сервера если есть статус 403 делаю  редирект на страницу авторизации
					if (res.data.status) {
						if (res.data.status.http_code === 403) {
							$injector.get('utorService').LogIn();
						}
					}						
					
					return res;
				},
                'responseError': function(res) {
					//status: {http_code: 403}, contents: "Token invalid - Invalid token: Stateless token expired"}
					//contents: "Token invalid - Invalid token: Stateless token expired"
					//status: {http_code: 403}
					//http_code: 403
					//alert(JSON.stringify(res));
					//------ сделал 500 для тестирования с запроса на комент без токена редирект, -------------------
					//-------------хотя в отображении убрал возможность отпр комент-----------------------------------
					// так потомучто ответ от прокси скрипта
					alert("res.status.http_code");
                    if(res.status.http_code === 401 || res.status.http_code === 403 || res.status.http_code === 500) {
                        alert("dasd");
						$location.path('signin');
                    }
                    return $q.reject(res);
                }
            };
        }]);
		
	});
	