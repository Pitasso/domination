'use strict';

app.controller('SettingsCtrl', ['User', '$scope', '$state', "$stateParams", "$rootScope", function(User, $scope, $state, $stateParams, $rootScope) {

			var user = new Stamplay.User().Model;
			user.currentUser().then(function() {
				user = user.instance;
				$scope.settings = {
					email : user.email,
					username : user.username,
					gamestyle : user.gamestyle,
					team : user.team,
					steam_id : user.steam_id,
					twitter_handle : user.identities.twitter._json.screen_name,
					facebook_handle : user.facebook_handle,
					twitch_id : user.twitch_id,
					youtube_channel : user.youtube_channel,
					email_preference : user.email_preference
				}
				$scope.$apply();
			})



		$scope.update = function() {
			var settings = angular.copy($scope.settings);
			var user = new Stamplay.User().Model;
			user.currentUser().then(function() {
				if(settings.email.length < 5) {
					Materialize.toast("Please enter a valid email address.", 4000);
					return;
				}
				user.set('email', settings.email);
				// if(settings.username.length < 2) {
				// 	Materialize.toast("Please enter a username.", 4000);
				// 	return;
				// }
				user.set('username', settings.username);
				user.set('gamestyle', settings.gamestyle);
				user.set('team', settings.team);
				user.set('steam_id', settings.steam_id);
				user.set('twitter_handle', settings.twitter_handle);
				user.set('facebook_handle', settings.facebook_handle);
				user.set('twitch_id', settings.twitch_id);
				user.set('youtube_channel', settings.youtube_channel);
				user.set('email_preference', settings.email_preference);
				user.save().then(function() {
					Materialize.toast("Your settings have been updated.", 4000)
					$rootScope.currentUser = user;
				})
			})
		}

}])
