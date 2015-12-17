'use strict';

app.controller('CollectionViewCtrl', ['Auth', '$scope', '$rootScope', '$state', 'Post', 'Search', '$uibModal', '$stamplay', '$stateParams', "moment", "$analytics", function(Auth, $scope, $rootScope, $state, Post, Search, $uibModal, $stamplay, $stateParams, moment, $analytics) {

	// Post.getPosts().then(function(posts) {
	// 	 posts.fetch().then(function() {
	// 		$scope.postCollection = posts.instance;
	// 	})
	// })

	// QuestionService.getQuestions().then(function(questions) {
 //        if(questions.instance.length) {
 //            $scope.noResults = false;
 //            $scope.questionCollection = questions.instance;
 //        } else {
 //            $scope.questionCollection = [];
 //            $scope.noResults = true;
 //        }
 //    })
	$scope.postCollection = [];

    var posts = new Stamplay.Cobject('post').Collection;

	posts.equalTo("type", "link").sortDescending(type).populateOwner().populate().fetch().then(function() {
		$scope.postCollection = posts.instance;
	});

	// var posts = new Stamplay.Cobject('post').Collection;

	// posts.populateOwner().populate().fetch().then(function() {
	// 	$scope.postCollection = posts.instance;
	// });

	// // LOADS NEXT DAY OF POSTS
	// $scope.getPosts = function(sort, start) {
	// 	$scope.fetchBy = sort;
	// 	if(start !== undefined) {
	// 		currentDay = start;
	// 		$scope.days = [];
	// 	}
	// 	// Track if we are loading more posts.
	// 	if(currentDay > 0) {
	// 		// $analytics.eventTrack('Loaded more posts');
	// 		console.log("Loading more posts.")
	// 	}
	// 	if($scope.processing) return;
	// 	$scope.processing = true;
	// 	var day = new Date(today.getTime() - (currentDay * 24 * 60 * 60 * 1000));
	// 	day = (day.getMonth() + 1) + "-" + day.getDate() + "-" + day.getFullYear();
	// 	Post.getPosts(sort, day).then(function(posts) {
	// 		days[currentDay] = {};
	// 		days[currentDay].posts = posts.instance;
	// 		day = Date.parse(day);
	// 		day = moment(day);
	// 		days[currentDay].date = day;
	// 		days[currentDay].page = posts.instance.length ? 1 : false;
	// 		$scope.days[currentDay] = days[currentDay];
	// 		currentDay += 1;
	// 		$scope.processing = false;
	// 	})
	// }

	// // INITIAL FETCH FOR POSTS
	// $scope.getPosts('actions.votes.total', currentDay);
	// console.log("Initial post load.");
	// $scope.processing = true;

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
        Page: 'Collection Page'
    });

}]);
