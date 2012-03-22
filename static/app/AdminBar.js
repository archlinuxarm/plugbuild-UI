/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {

	window.AdminBar = Backbone.View.extend({
		tagName: 'ul',
		className: 'gradient',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#adminbar-template').html());
			this.username = "Initializing";
		},
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
			this.$('#username-field').text(this.username);
			return this;
		}
	});	
})(jQuery);