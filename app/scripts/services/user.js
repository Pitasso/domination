'use strict';

app.factory('User', ['$q', '$stamplay', '$rootScope', function($q, $stamplay, $rootScope) {

	return {
		followUser: function(userId) {			
			var user = new Stamplay.User().Model;
			var q = $q.defer();
			user.follow('_id_of_user').then(function(followed){
			  //followed is the followed user
			},function(err){
			  //manage error
			});
			return q.promise;
		}
		getFollowers: function(userId) {

		}
		getFollow: function(userId) {

		}

	};
}])