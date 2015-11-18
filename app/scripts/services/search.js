'use strict';

app.factory('Search', ['$q', '$stamplay', 'algolia', 'Post', function($q, $stamplay, algolia, Post) {

	var client = algolia.Client('PGBXAMNR40', 'cdf9ba65ad72c29635726d3a9bf46743');
	var index = client.initIndex('dota.domination');

	return {
		searchPosts: function(query) {
			var q = $q.defer();
			index.search(query).then(function searchSuccess(content) {
				q.resolve(content);
			}, function searchFailure(err) {
				q.reject();
			})
			return q.promise;
		}
	}
}])