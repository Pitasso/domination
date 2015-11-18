'use strict';

app.controller('SearchCtrl', ['$scope', '$state', 'Search', function($scope, $state, Search) {

	$scope.searchPosts = function() {
		Search.searchPosts($scope.post_query).then(function(posts) {
			if(posts.hits.length) {
                $scope.noSearchResults = false;
                $scope.searchResults = posts.hits;
            } else {
                $scope.noSearchResults = true;
                $scope.searchResults = [];
            }
		})
	}

}]);