(function($) {

	window.ConsoleView = Backbone.View.extend({
		tagName: 'div',
		className: 'console',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#console-template').html());
			this.collection	= new ConsoleMessages();
			this.collection.bind('reset', this.render);
			this.collection.bind('add', this.render);
			this.collection.reset();
		},
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
      
			return this;
		}
	});	
})(jQuery);