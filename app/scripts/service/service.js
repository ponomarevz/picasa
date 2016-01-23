(function(){
'use strict';
/*jshint validthis:true */
	
	//var server = 'http://localhost:9000/data/feed/api/';

//	var server = 'http://picasaweb.google.com:80/data/feed/api/';

	//var server = 'http://etest.optimus-it.biz/prox.php?https://picasaweb.google.com:80/data/feed/api/';
//	var server_api = 'https://picasaweb.google.com/data/feed/api/';
	var server = 'http://etest.optimus-it.biz/prox.php?';

	//------------сервис для авторизации------------
	function autorService ($http, $localStorage, $state, $httpParamSerializerJQLike) {
		/*------------Валидация токена после входа и сохранение парааметров -------
		----------сохранение его в localStorage-----*/
		this.validation = function (tokenInfo) {
			//alert(JSON.stringify(tokenInfo));
			var resurs = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + tokenInfo.access_token;
						
			//-------------post запрос на авторизацию-------
			return $http({method: 'get', url: resurs}).
					then(function(res) { 
						
						
						if (res.status === 200) {
													
							$localStorage.tokenInfo = tokenInfo;
							$localStorage.user = res.data.email;
							$localStorage.userId = res.data.sub;
							$localStorage.token = 1;
							$localStorage.tokenQuery = '&access_token=' + tokenInfo.access_token;
							
							//-----------------не сохраняем в хистори--------------------------
							window.location.replace('http://etest.optimus-it.biz/#/albums/' + res.data.sub);
																												
						} else {
							res.status = 'Ви не авторизовані';
						}
					
						return res;
					}, function(res) {
						//---------если запрос не успешен возвр ответ 
						return res;
					});
					
		
		};
		
		//-----------логаут путем очистки токена в localStorage----------
		this.LogOut = function() {
			$localStorage.$reset();
			window.location = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://etest.optimus-it.biz';
		};
	}
	
	angular
		.module('App')
			.service('autorService', autorService);
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//------------сервис для извлечения товаров------------
				
	function albumService ($http, $httpParamSerializerJQLike, $localStorage) {
		
		var max_result = 16;
		var start = 1;
				
		//------------запрос списка продуктов-----
		this.getAlbum = function (autorId, albumId) {
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			}
			var resurs = server + 'url' + $httpParamSerializerJQLike(server_api + 'user/' + autorId +'/albumid/' + albumId + '?alt=json' + '&start-index=' + start + '&max-results=' + max_result + '&kind=photo' + q);
			
				return $http({method: 'get', url: resurs}).then(function(res) {
						start = start + max_result;
						
						return res.data.contents.feed;
					});
		
		};
		
		//------------обнуление стартового индекса-----
		this.setStart= function (st) {
				start = st;	
		};
		
	}
	
	angular
		.module('App')
			.service('albumService', albumService);
			
	//---------------------------------------------------------------------------------------------------------------------------------------
	

	//------------сервис для извлечения списка альбомов пользователя------------
				
	function userAlbumsService ($http, $httpParamSerializerJQLike, $localStorage) {
		
		var max_result = 20;
		var start = 1;
		
		//------------запрос списка альбомов-----
		this.getAlbums = function (autorId) {
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			}
			
			var resurs = server + 'url' + $httpParamSerializerJQLike(server_api + 'user/' + autorId + '?alt=json' + '&start-index=' + start + '&max-results=' + max_result + q);
							
				 return $http({method: 'get', url: resurs}).then(function(res) {
						
						start = start + max_result;
						return res.data.contents.feed;
					});
		};
		
		//------------добавить альбом-----
		this.addAlbum = function (autorId) {
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			}
			var resurs = server + 'user/' + autorId;// + '?alt=json';
							
				 return $http({method: 'POST', url: resurs}).then(function(res) {
						return res;
					});
		};
		
		//------------обнуление стартового индекса-----
		this.setStart= function (st) {
				start = st;	
		};
		
	}
	
	angular
		.module('App')
			.service('userAlbumsService', userAlbumsService);
			
			//------------сервис для извлечения списка альбомов пользователя------------
				
	function userPhotoService ($http, $httpParamSerializerJQLike, $localStorage) {
					
		//------------запрос списка продуктов-----
		this.getPhoto = function (userId, albumId, photoId) {
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			}
			var resurs = server + 'url' + $httpParamSerializerJQLike(server_api + 'user/' + userId + '/albumid/' + albumId + '/photoid/' + photoId + '?alt=json' + q);
			
				 return $http({method: 'get', url: resurs}).then(function(res) {
						return res.data.contents.feed;
					});
		};
	}
	
	angular
		.module('App')
			.service('userPhotoService', userPhotoService);


	//--------------установливаем токен для передачи в сервис-------------------
	angular
		.module('App')
			.provider('$auth', function() {
				var cred;
				
				var setCred = function(cr) {
					
					cred = cr;
				};
				
				var getCred = function() {
					
					return cred;
				}
				return {

					setCred: setCred,
					getCred: getCred,
					cred: cred,
										
					$get: function() {
						
						return {
							setCred: setCred,
							getCred: getCred
							
						};
					}

				};

		});
	
})(); //------локализируем обявления функций сервисов



  
  	