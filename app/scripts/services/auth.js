'use strict';

app.factory('Auth', ['$q', '$stamplay', '$uibModal', function($q, $stamplay, $uibModal) {

	var user = $stamplay.User().Model;

	return {
		login: function() {
			user.login('twitter');
		},
		logout: function() {
			user.logout('twitter');
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
