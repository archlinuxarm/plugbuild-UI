(function($) {

	window.ConsoleView = Backbone.View.extend({
		tagName: 'div',
		id: 'console',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#console-template').html());
			this.collection	= new ConsoleMessages();
			this.collection.bind('reset', this.render);
			this.collection.bind('add', this.render);
			this.collection.reset();
			
			var lthis = this;
			dispatcher.on('console:message',function(message) {
				console.log('Console view got message');
				lthis.collection.create(message);
				lthis.render();
			});
		},
		render: function() {
			console.log('rendering console');
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
      		var messageCache = document.createDocumentFragment();
      		
      		this.collection.each(function (message) {
      			console.log('looping console messages');
      			
      			var li = document.createElement('li');
				li.setAttribute('class','console-line');
				
				var message = document.createTextNode(message.get('consoleline'));
				li.appendChild(message);
	
				messageCache.appendChild(li);
				
      		});
      		this.$('#console-list').append(messageCache);
      		this.$('#display').prop({ scrollTop: this.$('#display').prop("scrollHeight") });
			return this;
		}
	});	
})(jQuery);