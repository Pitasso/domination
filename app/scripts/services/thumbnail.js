'use strict';

app.factory('Thumbnail', ['$q', '$stamplay', '$rootScope', function($q, $stamplay, $rootScope) {

	return {
		getFromUrl: function(url) {
			var q = $q.defer();
			var webshot = new Stamplay.Codeblock('webshot');
			webshot.run({ url: url }).then(function (response) {
			  if (response.success) {
			  	return q.resolve(response.data.thumbnail);
			  }
			  throw new Error(response.message || 'Unkown error');
			}, function( err ){
			  throw err;
			});
			return q.promise;
		}
	};
}])