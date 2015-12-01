'use strict';

app.controller('IndexViewCtrl', ['$scope', '$rootScope', '$state', 'Post', 'Search', '$uibModal', '$stamplay', '$stateParams', function($scope, $rootScope, $state, Post, Search, $uibModal, $stamplay, $stateParams) {

	// var postList = this;

	// postList.posts = [];
	// postList.page = 1;
	// postList.per_page = 10;
	// postList.sort = '-dt_create';

	// /* Loads the post given a sort parameter */
	// postList.loadPosts = function(posts) {

	// 	Post.getPosts().then(function(result) {
	// 			if (postList.posts.add) {
	// 				result.forEach(function(post) {
	// 					postList.posts.add(post);
	// 				})
	// 			} else {
	// 				postList.posts = result;
	// 				postList.totalLength = postList.posts.totalElements;
	// 			}
	// 			postList.page++;
	// 			postList.busy = false;
	// 		});
	// };

	// postList.loadNext = function(page) {
	// 	if (postList.posts.length !== postList.totalLength) {
	// 		postList.busy = true;
	// 		var params = {
	// 			sort: postList.sort,
	// 			page: page,
	// 			per_page: postList.per_page,
	// 			populate_owner: true,
	// 			populate: true
	// 		}

	// 		postList.loadPosts(params);

	// 	}
	// };

	// /* Listener on tab */
	// postList.sortPost = function(sortOn) {
	// 	postList.page = 1;
	// 	postList.totalLength = 0;
	// 	postList.posts = [];
	// 	switch (sortOn) {
	// 	case 'latest':
	// 		postList.sort = '-dt_create';
	// 		break;
	// 	case 'tranding':
	// 		postList.sort = '-actions.votes.total';
	// 		break;
	// 	default:
	// 		postList.sort = '-dt_create';
	// 		break;
	// 	}

	// 	postList.loadPosts({
	// 		sort: postList.sort,
	// 		page: postList.page,
	// 		per_page: postList.per_page,
	// 		populate_owner: true,
	// 		populate: true

	// 	});
	// };


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
		if($scope.processing) return;
		$scope.processing = true;
		var day = new Date(today.getTime() - (currentDay * 24 * 60 * 60 * 1000));
		day = (day.getMonth() + 1) + "-" + day.getDate() + "-" + day.getFullYear();
		Post.getPosts(sort, day).then(function(posts) {
			days[currentDay] = {};
			days[currentDay].posts = posts.instance;
			days[currentDay].date = new Date(day);
			days[currentDay].page = posts.instance.length ? 1 : false;
			$scope.days[currentDay] = days[currentDay];
			currentDay += 1;
			$scope.processing = false;
		})
	}

// LOADS THE NEXT POSTS IN A PARTICULAR DAY
	$scope.loadNextPage = function(sort, day, index) {
		$scope.days[index].loading = true;
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
	$scope.processing = true;


// METHOD TRIGGERS BY SCROLL TO BOTTOM OF PAGE 
	$scope.loadNextPosts = function() {
		$scope.getPosts($scope.fetchBy);
		$scope.processing = true;
	}


	$scope.approvePost = function(post, idx) {
		var today = new Date();
		var day = today.getDate();
		var month = today.getMonth() + 1;
		var year = today.getFullYear();
		var published = month + "-" + day + "-" + year;

		$scope.days[0].posts.splice(idx, 1);
		post.instance.owner = post.instance.owner._id;
		post.set("approved", true);
		post.set("dt_published", published);
		post.save().then(function() {
			$scope.$apply();
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
		// if(!$rootScope.currentUser) {
		// 	var loginModal = $uibModal.open({
		// 		templateUrl: "app/views/partial/permission.html",
		// 		windowClass: "login-window",
		// 		animation: false
		// 	})
		// } else {
		post.upVote().then(function() {
			$scope.postCollection[$index] = post;
			$scope.$apply();
		})
		// }
	}

	$scope.newPost = function() {
		if($rootScope.currentUser.instance.givenRole.name === 'registered') {
			var loginModal = $uibModal.open({
				templateUrl: "app/views/partial/permission.html",
				windowClass: "fullscreen",
				animation: false,
				resolve: {
					items: function() {
						return $scope.items;
					}
				}
			})
		} else {
			var postModal = $uibModal.open({
				templateUrl: "app/views/submit.html",
				controller : "SubmitPostCtrl",
				windowClass: "submit-window",
				resolve: {
					post: function () {
						return $scope.posts;
					}
				}
			})

			postModal.result.then(function(post) {
				var newpost = new $stamplay.Cobject("post").Collection;
				newpost.equalTo("_id", post.instance._id).populateOwner().fetch().then(function() {
					console.log(newpost.instance[0])
					$scope.postCollection.push(newpost.instance[0]);
					$scope.$apply();
				})
			})
		}
	}

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
