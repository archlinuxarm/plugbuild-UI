/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {

	window.DashboardView = Backbone.View.extend({
		tagName:	'div',
		className:	'dashboard',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.statusView = new StatusView();
			this.builderView = new BuilderView();
			

		},
    
		render: function() {
			$(this.el).empty();
			$(this.el).append($(this.statusView.render().el));
			$(this.el).append($(this.builderView.render().el));
			return this;
		}
	});
})(jQuery);