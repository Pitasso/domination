'use strict';

app.factory('Auth', ['$q', '$stamplay', '$uibModal', function($q, $stamplay, $uibModal) {
	
	var user = $stamplay.User().Model;

	return {
		login: function() {
			var q = $q.defer();
			user.login('twitter').then(function() {
				q.resolve(user.instance);
			})
			return q.promise;
		},
		logout: function() {
			var q = $q.defer();
			user.logout('twitter');
			return q.promise;
		},
		currentUser: function() {
			var q = $q.defer();
			user.currentUser().then(function() {
				q.resolve(user);
			})
			return q.promise;
		}
	}

}])