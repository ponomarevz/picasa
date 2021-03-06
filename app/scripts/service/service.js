(function(){
'use strict';
/*jshint validthis:true */
	
	var server1 = 'http://etest.optimus-it.biz/addAlbum.php?';
	var server_api = 'https://picasaweb.google.com/data/feed/api/';
	var server = 'http://etest.optimus-it.biz/prox.php?';
	
	//------------сервис для авторизации------------
	function autorService ($http, $localStorage, $state, $httpParamSerializerJQLike) {
		/*------------Валидация токена после входа и сохранение парааметров -------
		----------сохранение его в localStorage-----*/
		this.validation = function (tokenInfo) {
			
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
		
		//------------------------------LogIn()--------------------------
		
		this.LogIn = function() {
			
				var client_id='394850313404-35e3blaofgnk97j0618h900p0fr0ammf.apps.googleusercontent.com';
				var scope='email http://picasaweb.google.com/data/'; // --- такой токен
				var redirect_uri='http://etest.optimus-it.biz';
				var response_type='token';
				
				
				var url="https://accounts.google.com/o/oauth2/auth?scope=" + scope 
					+ '&client_id=' + client_id 
					+ '&redirect_uri=' + redirect_uri 
					+ '&response_type=' + response_type;
					
				window.location.replace(url);
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
				
	function albumService ($http, $httpParamSerializerJQLike, $localStorage, $q) {
		
		var max_result = 16;
		var start = 1;
				
		//------------запрос списка продуктов-----
		this.getAlbum = function (autorId, albumId) {
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			}
			
			var resurs = server + 'url' + $httpParamSerializerJQLike(server_api + 'user/' + autorId +'/albumid/' + albumId + '?alt=json' + '&start-index=' + start + '&max-results=' + max_result + '&kind=photo' + q);
			
				return $http({method: 'get', url: resurs})
					.then(
						//---------если запрос успешный обрабатываем и возвращаем обещание
						function(res) {
							start = start + max_result;
						
							return res.data.contents.feed;
						},
						/* -----------если ошибка обрабатываем и делаем режект для того 
						чтобы не попасть в блок успеха последующей обработки------ */
						function(err) {
							console.log(err);
							return $q.reject(new Error("Re Thrown"));
						}
					);
		
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
				
	function userAlbumsService ($http, $httpParamSerializerJQLike, $localStorage, $q) {
		
		var max_result = 20;
		var start = 1;
		
		
		//------------запрос списка альбомов-----
		this.getAlbumsCom = function () {
						
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			};
				
				var resurs = server + 'url' + $httpParamSerializerJQLike('https://picasaweb.google.com/data/feed/tiny/featured?alt=json&kind=photo&slabel=featured&max-results=' + max_result + '&start-index=' + start +q);		
						
				return $http({method: 'get', url: resurs}).then(function(res) {
						start = start + max_result;
						return res.data.contents.feed;
					});
		};
		
		//------------запрос списка альбомов-----
		this.getAlbums = function (autorId) {
			var q = '';
			if ($localStorage.tokenQuery) {
				q = $localStorage.tokenQuery;
			}
			var er = '';
			var resurs = server + 'url' + $httpParamSerializerJQLike(server_api + 'user/' + autorId + '?alt=json' + '&start-index=' + start + '&max-results=' + max_result + q);
							
				 return $http({method: 'get', url: resurs})
					.then(
						//---------если успех----------
						function(res) {
							
							start = start + max_result;
							if (res.data.contents instanceof Object) {
								return res.data.contents.feed;
							} else {
								er = new Error('My erorr -- ' + res.data.contents);
								return $q.reject(er); //-------------попадаем в блок ошибки 
							}
						},
						/* -----------если ошибка обрабатываем и делаем режект для того 
						чтобы не попасть в блок успеха последующей обработки------ */
						function(err) {
							console.log(err);
							er = new Error('My error -- (http error)');
							return $q.reject(er);
						}
					);
		};
		
		//------------добавить альбом-----
		this.addAlbum = function (autorId, al) {
			
			//----------формируем данные------------
			var data = {autorId: autorId,
						title: al.title,
						access: al.access.zn,
						description: al.description
				};
							
			if ($localStorage.tokenQuery) {
				data.token = $localStorage.tokenInfo.access_token;
			};
						
				 return $http({method: 'POST', 
							url: server1, 
							data: data 
							}).then(function(res) {
								// id -- https://googlrapi/user/album -- 
								var id_ar = res.data.id.split('/');
								var id_al = id_ar[id_ar.length - 1];
								
							//	window.location.replace('http://etest.optimus-it.biz/#/album/' +  autorId + "/" + id_al);
							res.id_al = id_al;
							
						return res;
					});
					//--------------отработка ошибок необходима----
		};
		
		
		this.deleAlbum = function (autorId, albumId) {
			
			//----------формируем данные------------
			var data = {autorId: autorId,
						albumId: albumId
				};
							
			if ($localStorage.tokenQuery) {
				data.token = $localStorage.tokenInfo.access_token;
			};
				var serverdele = 'http://etest.optimus-it.biz/delAlbum.php?';	
				 return $http({method: 'POST', 
							url: serverdele, 
							data: data 
							}).then(function(res) {
														
						return res;
					});
					//--------------отработка ошибок необходима----
		};
		
		
		
		this.addPhoto = function (autorId, albumId, img) {
			
			var serveraddP = 'http://etest.optimus-it.biz/addPhoto.php?';
			//----------формируем данные------------
			var data = {autorId: autorId,
						albumId: albumId,
						img: img
				};
							
			if ($localStorage.tokenQuery) {
				data.token = $localStorage.tokenInfo.access_token;
			};
						
				 return $http({method: 'POST', 
							url: serveraddP, 
							data: data 
							}).then(function(res) {
								
								if(res.data == 'ok') {
									//alert('http://etest.optimus-it.biz/#/album/' + autorId + '/' + albumId);
									window.location = 'http://etest.optimus-it.biz/#/album/' + autorId + '/' + albumId;
								}
						return res;
					});
					//--------------отработка ошибок необходима----
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
			.provider('$my', function(){
				var met = 30;
				console.log(met);
				return {
					//-----------провайдер---------
					getMet: function(when) {
						console.log('1 ' + when + ' ' + met);
					},
					incrMet: function(inc) {
					  met = met + inc;
					},
					
					$get: function() {
						return {
							//---------сервис-----------
							met:met,
							getMet: function(when) {
								console.log('2 ' + when + ' ' + met);
							}
							
						};
					}
				}
			});
	
})(); //------локализируем обявления функций сервисов



  
  	