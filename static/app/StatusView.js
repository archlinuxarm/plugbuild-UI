/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	window.StatusView = Backbone.View.extend({
		tagName: 'div',
		className: 'one-third column statusbox',
		
		
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#status-template').html());
			var loadavg = 0;
			var memused = 0;
			
					
			var lthis = this;
			dispatcher.on('status:system', function (status) {

				lthis.loadavg = status.loadavg[0].toFixed(1);
				lthis.memused = prettysize(status.memused);
				lthis.render();
			});

		},
    
		render: function() {
			console.log('Rendering status view');
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
			this.$('#loadavg').text(this.loadavg);
			this.$('#memused').text(this.memused);
      
			return this;
		}
	});
})(jQuery);