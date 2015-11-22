'use strict';

app.factory('Auth', ['$q', "$http", '$stamplay', '$uibModal', function($q, $http, $stamplay, $uibModal) {

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
		},
		getRole : function(id) {
			var q = $q.defer();
			$http.get("https://domination.stamplayapp.com/api/user/v1/roles/" + id)
			.then(function success(res) {
				q.resolve(res.data);
			}, function error(err) {
				q.reject(res.data);
			})
			return q.promise;
		}
	}

}])
