'use strict';

app.controller('IndexViewCtrl', ['Auth', '$scope', '$rootScope', '$state', 'Post', 'Search', '$uibModal', '$stamplay', '$stateParams', "moment", "$analytics", function(Auth, $scope, $rootScope, $state, Post, Search, $uibModal, $stamplay, $stateParams, moment, $analytics) {

	$scope.filterBy = function(type) {
		$scope.post_type = type;
	}

	$scope.days = [];
	$scope.processing = false;
	var days = [];
	var today = new Date();
	var currentDay = 0;


	// LOADS NEXT DAY OF POSTS
	$scope.getPosts = function(sort, start) {
		$scope.fetchBy = sort;
		if(start !== undefined) {
			currentDay = start;
			$scope.days = [];
		}
		// Track if we are loading more posts.
		if(currentDay > 0) {
			// $analytics.eventTrack('Loaded more posts');
			console.log("Loading more posts.")
		}
		if($scope.processing) return;
		$scope.processing = true;
		var day = new Date(today.getTime() - (currentDay * 24 * 60 * 60 * 1000));
		day = (day.getMonth() + 1) + "-" + day.getDate() + "-" + day.getFullYear();
		Post.getPosts(sort, day).then(function(posts) {
			days[currentDay] = {};
			days[currentDay].posts = posts.instance;
			day = Date.parse(day);
			day = moment(day);
			days[currentDay].date = day;
			days[currentDay].page = posts.instance.length ? 1 : false;
			$scope.days[currentDay] = days[currentDay];
			currentDay += 1;
			$scope.processing = false;
		})
	}

	// LOADS THE NEXT POSTS IN A PARTICULAR DAY
	$scope.loadNextPage = function(sort, day, index) {
		$scope.days[index].loading = true;
		day = day._d;
		var date = (day.getMonth() + 1) + "-" + day.getDate() + "-" + day.getFullYear();
		$scope.days[index].page += 1;
		Post.getPosts(sort, date, $scope.days[index].page).then(function(posts) {
			if(posts.instance.length < 9) $scope.days[index].page = false;
			posts.forEach(function(item, idx, arr) {
				$scope.days[index].posts.push(item);
			})
			$scope.days[index].loading = false;
		})
	}

	// GET UNAPPROVED POSTINGS FOR MODERATOR
	$scope.getUnapproved = function() {
		Post.getUnapproved().then(function(posts) {
			$scope.days.length = 1;
			$scope.days[0] = {};
			$scope.fetchBy = 'unapproved'
			$scope.days[0].posts = posts.instance;
		})
	}

	// INITIAL FETCH FOR POSTS
	$scope.getPosts('actions.votes.total', currentDay);
	console.log("Initial post load.");
	$scope.processing = true;

	// METHOD TRIGGERS BY SCROLL TO BOTTOM OF PAGE
	$scope.loadNextPosts = function() {
		$scope.getPosts($scope.fetchBy);
		$scope.processing = true;
	}

	$scope.approvePost = function(post, idx) {
		if(post.instance.approved === true) return;
		var _post = angular.copy(post);
		var tomorrow = Date.today().add(1).days()

		var day = tomorrow.getDate();
		var month = tomorrow.getMonth() + 1;
		var year = tomorrow.getFullYear();
		var published = month + "-" + day + "-" + year;
		_post.instance.owner = post.instance.owner._id;
		if(post.instance.type === "game") {
			var team1 = post.instance.team_1;
			var team2 = post.instance.team_2;
			_post.instance.team_1 = post.instance.team_1[0]._id;
			_post.instance.team_2 = post.instance.team_2[0]._id;
		}
		_post.set("approved", true);
		_post.set("dt_published", published);
		_post.save().then(function() {
			post.instance.approved = true;
			$scope.days[0].posts[idx] = post;
			$scope.$apply();

			console.log($scope.days[0].posts[idx]);
		})
	}

	if($stateParams.search) {
		Search.searchPosts($stateParams.search).then(function(posts) {
			if(posts.hits.length) {
				$scope.noSearchResults = false;
				$scope.searchResults = posts.hits;
			} else {
				$scope.noSearchResults = true;
				$scope.searchResults = [];
			}
		})
	}

	$scope.upvotePost = function($index, post) {
		if(!$rootScope.currentUser) {
			var loginModal = $uibModal.open({
				templateUrl: "app/views/partial/permission.html",
				controller: "AuthCtrl",
				windowClass: "fullscreen",
				animation: false,
				resolve: {
					items: function() {
						return $scope.items;
					}
				}
			})
			$analytics.eventTrack('Viewed Permission Denied Screen', {
				message: "Upvote post skill is not available"
			});
		} else {

			var team1 = post.instance.team_1;
			var team2 = post.instance.team_2;
			post.upVote().then(function() {
				post.instance.team_1 = team1;
				post.instance.team_2 = team2;
				$scope.$apply();
				$analytics.eventTrack('Upvoted Post', {
					"postId": post.instance._id,
					"postSlug": post.instance.slug,
					"from": 'Main Page'
				});
			}, function(err) {
        	Materialize.toast("You already upvoted this post!", 4000, 'warning')
    	})
		}
	}

	$analytics.eventTrack('Viewed Page', {
        Page: 'Main Page'
    });

}]);

// THIS CAN BE MOVED INTO ANOTHER FILE IN NEEDS BELOW

app.directive('whenScrolled', function() {
	return function(scope, elm, attr) {
		var raw = elm[0];
		var fetching = false;
		var bottom = 0;
		var funCheckBounds = function(evt) {
			var rectObject = raw.getBoundingClientRect();
			if(window.innerHeight - rectObject.bottom > -1 && fetching == false && scope.fetchBy !== 'unapproved') {
				scope.$apply(attr.whenScrolled);
				fetching = true;
				setTimeout(function() {
					fetching = false;
				}, 200)
			}
		};
		angular.element(window).bind('scroll load', funCheckBounds);
	}
});
