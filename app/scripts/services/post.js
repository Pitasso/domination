'use strict';

app.factory('Post', ['$q', '$stamplay', '$rootScope', 'algolia', function($q, $stamplay, $rootScope, algolia) {

	var client = algolia.Client('7TMV8F22UN', 'b5e5aa05c764aa1718bc96b793078703');
  	var index = client.initIndex('KBQUESTIONS');

	return {
		newPost: function(details) {
			var post = $stamplay.Cobject('post').Model;
			var q = $q.defer();
			post.set('type', details.type);
			post.set('slug', details.slug);
			post.set('title', details.title);
			post.set('desc', details.desc);
			post.set('url', details.url);
			post.set('thumbnail', details.thumbnail);
			post.set('team_1', details.team_1);
			post.set('team_2', details.team_2);
			post.set('date', details.date);
			post.set('approved', false);
			post.set('comment_count', 0);
			post.save().then(function(){
				q.resolve(post);
			})
			return q.promise;
		},
		getPosts: function(type, date, page) {
			var postCollection = $stamplay.Cobject('post').Collection;
			var q = $q.defer();
			if(page === undefined) page = 1;
			postCollection
			.sortDescending(type)
			.equalTo('dt_published', date)
			.populateOwner()
			.pagination(page, 10)
			.populate()
			.fetch().then(function() {
				q.resolve(postCollection);
			})
			return q.promise;
		},
		getUnapproved: function() {
			var postCollection = $stamplay.Cobject('post').Collection;
			var q = $q.defer();
			postCollection
			.sortDescending('dt_create')
			.equalTo('approved', false)
			.populateOwner()
			.pagination(1, 100)
			.populate()
			.fetch().then(function() {
				q.resolve(postCollection);
			})
			return q.promise;
		},
		getPostDetails: function(slug) {
			var post = $stamplay.Cobject('post').Collection;
			var comments = $stamplay.Cobject('comment').Collection;
			var user = $stamplay.User().Model;
			var q = $q.defer();
			post.equalTo('slug', slug).populate().fetch().then(function() {
				comments.equalTo('slug', slug).populateOwner().fetch().then(function() {
					user.fetch(post.instance[0].instance.owner).then(function() {
						post.instance[0].instance.owner = user.instance;

						q.resolve({ post : post.instance[0], comments : comments });
					}, function(data) { q.reject(data) })
				})
			})
			return q.promise;
		},
	 	addComment: function(body, slug, owner_email) {
            var q = $q.defer();
            var comment = $stamplay.Cobject("comment").Model;
            // var post = $stamplay.Cobject("post").Model;
            comment.set("body", body);
						comment.set("slug", slug)
            if(owner_email) {
                comment.set("comment_owner", owner_email);
            }
            comment.save().then(function() {
                q.resolve(comment);
            })
            return q.promise;
        },
		refreshPosts: function(post){
			var q = $q.defer();
			q.resolve(post);
			return q.promise;
		},
		upvotePost: function(id) {
			var post = $stamplay.Cobject('post').Model;
			var q = $q.defer();

			post.fetch(id).then(function() {

				post.upVote().then(function() {
						q.resolve(post);
					}).fail(function(err) {
						alert('You already voted for this post.');
					});
			})
			return q.promise;
		},
		getUpvoters: function(userId) {
			var userList = $stamplay.User().Collection;
			var q = $q.defer();
			userList.fetch().then(function() {
				q.resolve(userList);
			})
			return q.promise;
		}
	}
}]);
