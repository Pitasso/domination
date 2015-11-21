/* global app:true */

'use strict';
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 3000)
var app = angular.module("Domination", [
    "ui.router",
    "ui.bootstrap",
    "ngStamplay",
    "algoliasearch",
    "angularMoment",
    "infinite-scroll"
    ])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true)
    $stateProvider
        .state("Home", {
            url: "/",
            templateUrl: "app/views/indexView.html",
            controller: "IndexViewCtrl"
        })
        .state("Post", {
            url: "/post/:slug",
            templateUrl: "app/views/postView.html",
            controller: "PostViewCtrl"
        })
        .state("Profile", {
            url: "/user/:displayName",
            templateUrl: "app/views/profile.html",
            controller: "ProfileCtrl"
        })
        .state("Membership", {
            url: "/membership",
            templateUrl: "app/views/membership.html",
            controller: "MembershipCtrl"
        })
    $urlRouterProvider.otherwise("/");
}])

.run(["$stamplay", "$rootScope", "Auth", function($stamplay, $rootScope, Auth) {
    Stamplay.init("Domination");
    Auth.currentUser().then(function(user) {
        if(user.isLogged()) {
            $rootScope.currentUser = user.instance;
            if(user.instance && !user.instance.username) {
              $rootScope.welcome();
            }
        } else {
            $rootScope.currentUser = false;
        }
    });
}]);
