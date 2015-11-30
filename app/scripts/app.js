/* global app:true */

'use strict';
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 3000)
var app = angular.module("Domination", [
    "ui.router",
    "ui.bootstrap",
    "ngStamplay",
    "algoliasearch",
    "angularMoment",
    "infinite-scroll",
    "ngMessages"
    ])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
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
            url: "/user/:username",
            templateUrl: "app/views/profile.html",
            controller: "ProfileCtrl"
        })
        .state("Membership", {
            url: "/membership",
            templateUrl: "app/views/membership.html",
            controller: "MembershipCtrl"
        })
        .state("Settings", {
            url: "/settings",
            templateUrl: "app/views/settings.html",
            controller: "SettingsCtrl"
        })
    $urlRouterProvider.otherwise("/");

}])

.run(["$stamplay", "$rootScope", "Auth", function($stamplay, $rootScope, Auth) {
    Stamplay.init("Domination");
    Auth.currentUser().then(function(user) {
        if(user.isLogged()) {
            Auth.getRole(user.instance.givenRole)
            .then(function(role) {
              user.instance.givenRole = role;
              $rootScope.currentUser = user;
              // $rootScope.resize = function(url) {
              //   if(!url) return;
              //   url = url.split("_normal").join("");
              //   return url;
              // }
              if(!user.instance.email || !user.instance.username) {
                $rootScope.welcome();
              }
            })
        } else {
            $rootScope.currentUser = false;
        }
    });
    // $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState) {
    //   if(toState.name !== "Membership" || fromState.name === "Membership") {
    //     $rootScope.membership = false;
    //     console.log(toState);
    //   }
    // })
}]);
