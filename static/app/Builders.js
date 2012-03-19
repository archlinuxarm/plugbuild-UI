/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
 

(function($) {
	window.Builder = Backbone.Model.extend({
		defaults: {
			fqn: null,
			arch: null,
			name: null,
			state: null
        },
        idAttribute: "fqn",
        sync: function() {
        
        },
		initialize: function(attributes,options){
			var pa = attributes.fqn.split('/');
			
			this.set({'arch': pa[0] });
			this.set({'name': pa[1] });

        }
	});

	window.Builders = Backbone.Collection.extend({
		initialize: function(){

			
        },
		model: Builder
	});
})(jQuery);