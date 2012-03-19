/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
 

(function($) {
	window.Message = Backbone.Model.extend({
		defaults: {
			line: null
        },
        sync: function() {
        
        },
		initialize: function(){

			
        }
	});

	window.ConsoleMessages = Backbone.Collection.extend({
		initialize: function(){

			
        },
		model: Message
	});
})(jQuery);