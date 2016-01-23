'use strict';

	angular.module('App', ['ui.router', 'ngAnimate', 'ngStorage', 'dc.endlessScroll']);
	
		angular.module('App').
		config(function($stateProvider, $authProvider) {
		
			
		$stateProvider
		.state('about', {
				url:'/about',
				views: {
					'centrV@' : {
						templateUrl:'views/about.html',
					},
				},
			})
			.state('validation', {
				url:'/validation',
				resolve: {
					valid: function(autorService) {
						
						var tokenInfo = $authProvider.getCred();
						return autorService.validation(tokenInfo);
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
	.config(function($urlRouterProvider, $httpProvider, $authProvider){
		 
		$urlRouterProvider.when('', '/albums/109660663401260259529').
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
						$authProvider.setCred(tokenInfo);
							return "/validation"; 
					}
					
			});
		//------ если токен существует добавляем к запросу текен если отве 401 или 403 или 500 делаем редирект--------
		//----------------------------- таким образом обрабатываем каждый запрос к серверу--------------------
		$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage,  $httpParamSerializerJQLike) {
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
                'responseError': function(res) {
					//alert(JSON.stringify(res));
					//------ сделал 500 для тестирования с запроса на комент без токена редирект, -------------------
					//-------------хотя в отображении убрал возможность отпр комент-----------------------------------
                    if(res.status === 401 || res.status === 403 || res.status === 500) {
                        $location.path('signin');
                    }
                    return $q.reject(res);
                }
            };
        }]);
		
	});
	