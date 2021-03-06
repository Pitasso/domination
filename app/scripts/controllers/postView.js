'use strict';

app.controller('PostViewCtrl', ['Post', 'Auth', '$scope', '$rootScope', '$state', '$stateParams', '$stamplay', "$http", "$analytics", '$uibModal', function(Post, Auth, $scope, $rootScope, $state, $stateParams, $stamplay, $http, $analytics, $uibModal) {
    var vm = this;
    vm.time = new Date();

    if(!$stateParams.slug) $state.go("Home");

    Post.getPostDetails($stateParams.slug).then(function(res) {
        $scope.post = res.post;
        $scope.comments = res.comments.instance;
        getUpvoters(res.post.instance.actions.votes.users);
        $analytics.eventTrack('Viewed Post Page', {
            Page: $stateParams.slug
        });
    })

    $scope.upvotePost = function(post) {
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
            var _post = angular.copy(post);
            post.upVote().then(function() {
                if(!$scope.upvoters) $scope.upvoters = [];
                $scope.upvoters.push($rootScope.currentUser.instance);
                post.instance.team_1 = _post.instance.team_1;
                post.instance.team_2 = _post.instance.team_2;
                post.instance.tournament = _post.instance.tournament;
                $scope.$apply();
                $analytics.eventTrack('Upvoted Post', {
                    "postId": post.instance._id,
                    "postSlug": post.instance.slug,
                    "from": 'Post Page'
                });
            }, function(err) {
                Materialize.toast("You already upvoted this post!", 4000, 'warning')
            })
        }
    }

    $scope.upvoteComment = function(comment) {
        var owner = comment.instance.owner;
        comment.upVote().then(function() {
            comment.instance.owner = owner;
            $scope.$apply();
        }, function(err) {
            Materialize.toast("You already upvoted this comment!", 4000, 'warning')
        })
    }

    $scope.addComment = function(comment) {
    // $scope.processing_comment = true;
        Post.addComment(comment, $stateParams.slug, $scope.post.instance.owner.email).then(function(res) {
            res.instance.owner = $rootScope.currentUser.instance;
            incrementCommentCount();
            $scope.comments.push(res);
            $scope.comment_form = false;
        })
    }

    $scope.addReply = function(comment, reply, idx) {
        var owner = comment.instance.owner;
        comment.comment(reply).then(function() {
            comment.instance.owner =  owner;
            $scope.comments[idx].instance.actions.comments = comment.instance.actions.comments;
            incrementCommentCount();
        })
        $scope.reply_open = false;
    }


    var incrementCommentCount = function() {
        var owner = $scope.post.instance.owner;
        var count = $scope.post.instance.comment_count ? $scope.post.instance.comment_count + 1 : 1;
        $scope.post.set("comment_count", count);
        $scope.post.set("owner", $scope.post.instance.owner._id);
        $scope.post.save().then(function() {
            $scope.post.instance.owner = owner;
            $scope.$apply();
        })
    }

    var getUpvoters = function(upvoters) {
        $scope.upvoters = [];
        var user = new Stamplay.User().Model;
        upvoters.forEach(function(item, idx, arr) {
            $http.get("https://dota.joingamers.net/api/user/v1/users/" + item)
            .then(function(data) {
                $scope.upvoters[idx] = data.data
            }, function(err) {
                console.error(err)
            })
        })
    }

    $scope.login = function() {
        Auth.login();
    }

}])
