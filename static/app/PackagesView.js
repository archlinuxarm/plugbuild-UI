/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	window.PackagesView = Backbone.View.extend({
		tagName: 'div',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#packages-template').html());
			this.collection	= new Packages();
			this.collection.bind('reset', this.render);
			this.collection.reset();

			
			this.currentindex = 0;
			
			this.tempScrollTop = 0;
			this.currentScrollTop = 0;
			
			var lthis = this;
			dispatcher.on('package:snapshot',function(snapshot) {
				console.log('Package view got snapshot');
				lthis.collection.reset(snapshot);
			});
			dispatcher.on('package:update',function(package) {
				console.log('Package view got update');
				model = lthis.get(package['package']);
				if (model) {
					lthis.collection.remove(model);
    			}
				lthis.create(package);
				lthis.render();
			});			

		},
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
			console.log('Packages view rendering');
			

			var listCache = document.createDocumentFragment();
			var lthis = this;	
		
			var pslice = this.collection.filter(function(package) {
				var ind = lthis.collection.indexOf(package)
				return ( ( ind >= lthis.currentindex ) && ( ind <= ( lthis.currentindex + 20) ) );
			});

			var pslicecollection = new Backbone.Collection(pslice);

			pslicecollection.each(function(package) {
				
				var li = document.createElement('li');
				li.setAttribute('class','package-item');
				
				var name = document.createTextNode(package.get('package'));
				li.appendChild(name);
				
				var repo = document.createTextNode(package.get('repo'));
				li.appendChild(repo);
				listCache.appendChild(li);
			});
			this.$('#package-list').html(listCache.cloneNode(true));
			this.$('#package-list').scroll(function() {
				lthis.currentScrollTop = lthis.$("#package-list").scrollTop();

				if (lthis.tempScrollTop < lthis.currentScrollTop ) {
					console.log("Scroll down");
				}
				else if (lthis.tempScrollTop > lthis.currentScrollTop ) {
					console.log("Scroll up");
				}
				lthis.tempScrollTop = lthis.currentScrollTop;
			});
			this.$('#number-all-packages').text(this.collection.length);
			this.$('#next-button').click(function() {
				console.log('Next');
				if ( ( lthis.currentindex +20 ) >= lthis.collection.length) return false;;
				lthis.currentindex = lthis.currentindex + 20;
				lthis.render();
			});			
			this.$('#previous-button').click(function() {
				console.log('Previous');
				lthis.currentindex = lthis.currentindex - 20;
				if (lthis.currentindex < 0) lthis.currentindex = 0;
				lthis.render();			
			});
			this.$('#current-index').text(this.currentindex);
			
			return this;
		}
	});	
})(jQuery);