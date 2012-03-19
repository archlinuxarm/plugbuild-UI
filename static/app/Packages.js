/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
 

(function($) {
	window.Package = Backbone.Model.extend({
		defaults: {
			package: null,
			version: null,
			v5_done: null,
			v7_done: null,
			v5_fail: null,
			v7_fail: null,
			repo: null
        },
        idAttribute: "package",
        sync: function() {
        
        },
		initialize: function(){

			
        }
	});
  
	window.Packages = Backbone.Collection.extend({
		initialize: function(){

			
        },
		model: Package,
		comparator: function(package) {
			return package.get("package");
		}
	});
})(jQuery);