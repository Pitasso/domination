/* global app:true */

'use strict';
var app = angular.module("Domination", [
    "ui.router",
    "ui.bootstrap",
    "ngStamplay",
    "algoliasearch",
    "angularMoment",
    "ngMessages"
    ])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$sceDelegateProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {
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
        .state("Invite", {
            url: "/invite",
            templateUrl: "app/views/invite.html",
            controller: "InviteCtrl"
        })
        .state("Terms", {
            url: "/terms",
            templateUrl: "app/views/terms.html",
        })
        .state("Privacy", {
            url: "/privacy",
            templateUrl: "app/views/privacy.html",
        })
    $urlRouterProvider.otherwise("/");

    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://www.youtube.com/embed/**',
    'https://www.youtube.com/embed/**',
    'http://player.twitch.tv/**',
    'https://player.twitch.tv/**'
    ])

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
