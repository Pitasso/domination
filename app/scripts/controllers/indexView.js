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


			$scope.postCollection = [];
			var page = 1;
			var pagination = false;
			$scope.getPosts = function(type, page_number, pagination) {
				if(!pagination && page_number === 1) {
					page = 1;
					$scope.noMore = false;
				}
				$scope.type = type;
				$scope.fetchBy = type;
				Post.getPosts(type, page_number).then(function(posts, type) {
					if(posts.instance.length) {
						$scope.noResults = false;
						if(pagination) {
							posts.instance.forEach(function(item, idx, arr) {
								$scope.postCollection.push(item);
							})
						} else {
							$scope.postCollection = posts.instance;
						}
					} else {
						// $scope.postCollection = [];
						// $scope.noResults = true;
						if(posts.instance.length === 0) {
							$scope.noMore = true;
						}
					}
				})
			}
			$scope.getPosts('dt_create', page);
			$scope.fetchBy = 'dt_create';

			$scope.loadNextPosts = function() {
				if(!$scope.noMore) {
					page += 1
					pagination = true
					$scope.getPosts($scope.type, page, pagination);
				}
			}
			// Initial Posts Fetch - Latest

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
				post.upVote().then(function() {
					$scope.postCollection[$index] = post;
					$scope.$apply();
				})
			}

			$scope.newPost = function() {
				if($rootScope.currentUser.instance.givenRole.name === 'registered') {
					var loginModal = $uibModal.open({
						templateUrl: "app/views/login.html",
						controller: "AuthCtrl",
						windowClass: "login-window",
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
