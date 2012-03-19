/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	window.SettingsView = Backbone.View.extend({
		tagName: 'div',
		className: 'settings',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#settings-template').html());

		},
    
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);

			return this;
		}
	});
})(jQuery);