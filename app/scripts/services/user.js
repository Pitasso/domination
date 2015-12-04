'use strict';

app.factory('User', ['$q', '$http', '$stamplay', '$rootScope', function($q, $http, $stamplay, $rootScope) {

	return {
		followUser: function(userId) {
			var q = $q.defer();
			$rootScope.currentUser.follow(userId).then(function(followed) {
				q.resolve();
			})
			return q.promise;
		},
		unfollowUser: function(userId) {
			var q = $q.defer();
			$rootScope.currentUser.unfollow(userId).then(function(unfollowed) {
				q.resolve();
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
		getUpvoted: function(userId) {
			// https://domination.stamplayapp.com/api/cobject/v1/post?where={%22actions.votes.users%22:{%22$in%22:%20[%225650b7236a5d9dab74915860%22]%20}}
			var q = $q.defer();
			$http.get('https://dota.joingamers.net/api/cobject/v1/post?where={"actions.votes.users":{"$in": ["' + userId + '"]}}').then(function(res) {
					q.resolve(res.data);
			})
			return q.promise;
		}

	};
}])
