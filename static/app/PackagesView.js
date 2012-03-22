/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	window.PackagesView = Backbone.View.extend({
		tagName: 'div',
    	id:		'package-wrap',
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#packages-template').html());

		  
			
			var lthis = this;
			
			Ext.define('Package', {
        		extend: 'Ext.data.Model',
         		fields: [
		           		{name: 'package'},
		           		{name: 'version'},
		          	 	{name: 'v5_done'},
		           		{name: 'v7_done'},
		           		{name: 'v5_fail'},
		           		{name: 'v7_fail'},
		           		{name: 'repo'}
        		]
    		});
    
    
    
			dispatcher.on('package:snapshot',function(snapshot) {
				lthis.render();
				console.log('Package view got snapshot');
				
		    	lthis.store = Ext.create('Ext.data.ArrayStore', {
        			id: 'store',
        			pageSize: 50,
        			// allow the grid to interact with the paging scroller by buffering
        			buffered: true,
        			// never purge any data, we prefetch all up front
        			purgePageCount: 0,
        			model: 'Package',
       			 	proxy: {
       			    	type: 'memory'
       				}
		    	});
		    	console.log('Created extjs store, starting grid');
			    lthis.grid = Ext.create('Ext.grid.Panel', {
			        store: lthis.store,
					verticalScroller: {
			           xtype: 'paginggridscroller',
			           activePrefetch: false
			        },
			        height:400,
			        layout: 'fit',
			        loadMask: true,
			        disableSelection: false,
			        invalidateScrollerOnRefresh: false,
			        viewConfig: {
			            trackOver: false
			        },
			        columns: [
			            {
			                text     : 'Package',
			                flex     : 1,
			                sortable : true,
			                dataIndex: 'package'
			            },
			            {
			                text     : 'Repo',
			                width    : 75,
			                sortable : true,
			                dataIndex: 'repo'
			            },
			            {
			                text     : 'v5 State',
			                width    : 75,
			                sortable : true,
			               
			                dataIndex: 'v5_done'
			            },
			            {
			                text     : 'v7 State',
			                width    : 75,
			                sortable : true,
			               
			                dataIndex: 'v7_done'
			            },
			            {
			                text     : 'v5 Fail',
			                width    : 75,
			                sortable : true,
			                dataIndex: 'v5_fail'
			          	},
			            {
			                text     : 'v7 Fail',
			                width    : 75,
			                sortable : true,
			                dataIndex: 'v7_fail'
			            }
			        ],
			   
			        renderTo: 'package-list',
			        viewConfig: {
			            stripeRows: true
			        }			
				});
				console.log('Created grid');
				
				var package_count = 0;
				for (e in snapshot) { package_count++; }
				var records = [];
				var i = 0;
			    for (; i < package_count; i++) {
			        records.push(Ext.ModelManager.create(snapshot[i], 'Package'));
			    }
				lthis.store.cacheRecords(records);

    			lthis.store.guaranteeRange(0, 49);
    			console.log('Stored package snapshot in ExtJS store');
			  	//Ext.EventManager.onWindowResize(lthis.grid.doLayout, lthis.grid);
			  	$(window).resize(function() {
  					lthis.resizeGrid();
				});
			  

			});
			dispatcher.on('package:update',function(package) {
				console.log('Package view got update');
				
				//model = lthis.collection.get(package['fqn']);
				//if (model) {
				//	lthis.collection.remove(model);
    			//}
				//lthis.collection.create(package);
				//lthis.grid.updateRowCount();
				//lthis.grid.render();
			});
			
			dispatcher.on('console:resized', function () {
				
				lthis.resizeGrid();
			});		
						
						
		},
		resizeGrid: function(grid) {
			console.log('resizing grid');
			
			var content_height = this.$('#package-list').height();
			this.grid.setHeight(content_height);
		},
		render: function() {
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
			console.log('Packages view rendering');
			//var lthis = this;
			return this;
		}
	});	
})(jQuery);