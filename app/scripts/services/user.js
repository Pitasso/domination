'use strict';

app.factory('User', ['$q', '$http', '$stamplay', '$rootScope', function($q, $http, $stamplay, $rootScope) {

	return {
		followUser: function(userId) {
			var q = $q.defer();
			$rootScope.currentUser.follow(userId).then(function(followed) {
				console.log("following")
				console.log(followed)
			})
			return q.promise;
		},
		getUser: function(username) {
			var q = $q.defer();
			var user = new $stamplay.User().Collection;
			user.equalTo('username', username).fetch().then(function() {
				q.resolve(user.instance[0]);
			})
			return q.promise;
		},
		getFollowers: function(userId) {
			// var
		},
		getFollow: function(userId) {

		}

	};
}])
