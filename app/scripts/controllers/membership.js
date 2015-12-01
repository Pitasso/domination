'use strict';

app.controller('MembershipCtrl', ['$scope','$http', '$rootScope', '$state', '$stateParams', '$stamplay', function($scope, $http, $rootScope, $state, $stateParams, $stamplay) {

    $scope.requestMembership = function() {
        $scope.processing = true;
        $http({
            method: "POST",
            url : "http://dota.domination.cc/api/codeblock/v1/run/prefinery",
            data : { "email": $rootScope.currentUser.instance.email }
        }).then(function(data) {
            $rootScope.currentUser.set('prefinery_id', data.data.id);
            $rootScope.currentUser.save().then(function() {
                console.log('Requesting memebrship');
                $scope.$apply();
                $scope.membershipRequested = true;
                $http.post("http://dota.domination.cc/api/codeblock/v1/run/prefinerydetails", { id : $rootScope.currentUser.instance.prefinery_id})
                .then(function(data) {
                    $scope.share_link = data.data.share_link;
                    $scope.clicks = data.data.share_clicks_count;
                    $scope.signups = data.data.share_signups_count;
                    $scope.processed = true;
                }, function(err) {
                    console.log(err)
                })
            })
        }, function(err) {
            console.error(err);
        })
    }

    var delay = setTimeout(function() {
        if (!$rootScope.currentUser.instance.prefinery_id) {
            console.log('No Prefinery_id');
            $scope.membershipRequested = false;
        } else {
            $scope.membershipRequested = true;
            $http.post("http://dota.domination.cc/api/codeblock/v1/run/prefinerydetails", { id : $rootScope.currentUser.instance.prefinery_id})
            .then(function(data) {
                $scope.share_link = data.data.share_link;
                $scope.clicks = data.data.share_clicks_count;
                $scope.signups = data.data.share_signups_count;
                $scope.processed = true;
            }, function(err) {
                console.log(err)
            })
        }
    }, 300)

}])

//
