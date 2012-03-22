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
        
        sync: function() {
        
        },
		initialize: function(attributes,options){
			var arch = attributes.arch;
			var packagename = attributes.package;
			
			
			
			this.set({'id': arch + '/' + packagename });

        }
	});
  
	window.Packages = Backbone.Collection.extend({
		initialize: function(){

			this.sortby = "package";
			var lthis = this;
			dispatcher.on('packages:sort',function(sortby) {
				if (sortby) {
        			lthis.sortby = sortby[0];
        		}
        		return lthis.sortby;
			});
			
        },
		model: Package,
		comparator: function(package) {
			return package.get(this.sortby);
		}
	});
})(jQuery);