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
			var lthis = this;
			dispatcher.on('page:dashboard', function(){ 
				lthis.dashboard();
			});
			dispatcher.on('page:packages', function(){ 
				lthis.packages();
			});
			dispatcher.on('page:settings', function(){ 
				lthis.settings();
			});
		},
		events: {
			"click #dashboard-button": "dashboard",
			"click #packages-button": "packages",
			"click #settings-button": "settings"
        }, 
		dashboard: function() {

			$('.adminbutton').removeClass('selected'); 
			$('#dashboard-button').addClass('selected'); 
		},
		packages: function() {

			$('.adminbutton').removeClass('selected'); 
			$('#packages-button').addClass('selected');
		},
		settings: function() {

			$('.adminbutton').removeClass('selected'); 
			$('#settings-button').addClass('selected');
		},
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
			this.$('#username-field').text(this.username);
			return this;
		}
	});	
})(jQuery);