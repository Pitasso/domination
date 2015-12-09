'use strict';

app.controller('SubmitPostCtrl', ['Post', 'Thumbnail', '$scope', '$rootScope', '$uibModalInstance', '$state', "$q", "algolia", function(Post, Thumbnail, $scope, $rootScope, $uibModalInstance, $state, $q, algolia) {

	var client = algolia.Client('PGBXAMNR40', 'cdf9ba65ad72c29635726d3a9bf46743');
	var index = client.initIndex('dota.teams');

	$scope.search = function(query, team) {
		if(query === undefined || query.length <= 1) {
			return;
		}
		var q = $q.defer();
		index.search(query)
		.then(function searchSuccess(content) {
			if(team === 'team_1') {
				$scope.teams_1 = content.hits;
			} else if(team === 'team_2') {
				$scope.teams_2 = content.hits;
			}
			q.resolve();
		}, function searchFailure(err) {
			console.error(err);
			q.reject();
		})
		return q.promise;
	}

	$scope.closeTypeahead = function(team) {
		setTimeout(function() {
			if(team === 'teams_1') {
				console.log('1')
				$scope.teams_1.length = 0;
			} else if(team === 'teams_2') {
				console.log('2')
				$scope.teams_2.length = 0;
			}
			$scope.$apply();
		}, 100)
	}
	$scope.setTeam1 = function(team) {
		$scope.tabs.post.team_1 = {
			id : team._id,
			name : team.name
		}
	}

	$scope.setTeam2 = function(team) {
		$scope.tabs.post.team_2 = {
			id : team._id,
			name : team.name
		}
	}

	$scope.tabs = [];
  	$scope.tabs.post = { type : 'link' };
		$scope.tabs.post.team_1 = {};
		$scope.tabs.post.team_2 = {};

	$scope.newPost = function() {
		var details = $scope.tabs.post;
		var slug = '';
		if(details.type === 'link') {
			slug = details.title.split(' ').join('-');
		} else {
			var team_1 = details.team_1.name.split(' ').join("-");
			var team_2 = details.team_2.name.split(' ').join("-");
			var title = details.title.split(' ').join("-");
			details.team_1 = details.team_1.id;
			details.team_2 = details.team_2.id;
			slug = team_1 + "-vs-" + team_2 + "-" + title;
		}
		slug = slug.toLowerCase();
		$scope.tabs.post.slug = slug;
		var values = angular.copy($scope.tabs.post);

		// Thumbnail.getFromUrl(values.url).then(function(thumbnail) {
		// 	values.thumbnail = thumbnail;

			Post.newPost(values).then(function(post) {
				Materialize.toast('Your post has been submitted.', 3000)
				$uibModalInstance.close(post);
			});
		// }, function(err) {
		// 	alert(err.message);
		// });
	}

}])
