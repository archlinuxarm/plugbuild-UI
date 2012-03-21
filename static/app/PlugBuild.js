/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	//create a backbone router to handle page changes
	window.PlugBuild = Backbone.Router.extend({
		routes: {
			'/dashboard': 'dashboard',
			'/settings': 'settings', 
			'/packages': 'packages'
		},
    
		initialize: function() {
			this.dashboardView	= new DashboardView();
			this.settingsView	= new SettingsView();
			this.packagesView	= new PackagesView();
			
			this.builderView = new BuilderView();
			var $sidebarContainer = $('#sidebar');
			$sidebarContainer.append($(this.builderView.render().el));
			
			
			this.adminBar		= new AdminBar();
			var $adminBarContainer = $('#adminbar');
			$adminBarContainer.append(this.adminBar.render().el);
			
			
			this.consoleView    = new ConsoleView();
			var $consoleContainer = $('#console-container');
			$consoleContainer.append(this.consoleView.render().el);	
			
			// this is here to facilitate the command box being able to fire off events when you press enter to run something	
	    		$("#command-field").keyup(function(event){
    				if(event.keyCode == 13){
    					var shellcommand = $('#command-field').val();
    					if (!shellcommand.length >= 1) return false;
        				dispatcher.trigger('command:send', { command: "echo", consoleline: shellcommand });
        				$('#command-field').val('');
    				}
			});
	
			var lthis = this;
			// done with setup of backbone stuff so we can setup the websocket now
			this.socket = io.connect('https://archlinuxarm.org:7050', {secure: true});
    			this.socket.on('connect', function () {
        			dispatcher.trigger('console:message', { consoleline: '[Socket] Connected' });
    			});
			this.socket.on('disconnect',function(){
        			dispatcher.trigger('console:message', { consoleline: '[Socket] Closed' });
    			});
     			this.socket.on('init',function(data) { 
        			dispatcher.trigger('console:message', { consoleline: "[Init] Received initial package and builder state snapshots" });
        		
        			//grab the username out of the response and ship it around
        			var user = data.user;
        			window.username = user;
        			lthis.adminBar.username = user;
        			lthis.adminBar.render();

				var builder_snapshot = [];
				
				for (var key in data.builders) {
        	        		var nbuilder = data.builders[key];
            	    			builder_snapshot.push(nbuilder);				
				}
				dispatcher.trigger('builder:snapshot', builder_snapshot);
        		
        			// snapshot of the current builder package state, push it out to the packages 
        			// collection so it can be modeled and stored
        			var package_snapshot = [];
                		for ( var key in data.packages) {
        	        		var npackage = data.packages[key];
        	        		// using the package name for the collection model id makes it easy to query and 
        	        		// update the store later on when sockets fire updates
            	    			package_snapshot.push(npackage);
            			}
        			dispatcher.trigger('package:snapshot', package_snapshot);

        			lthis.navigate("/#/dashboard", {trigger: true});
	    		});
	    		this.socket.on('package',function(data){
	        		dispatcher.trigger('console:message', { consoleline: '[Update] ' + data.package });
	        		dispatcher.trigger('package:update', data);
	    		});
	    		this.socket.on('builder',function(data){
	        		dispatcher.trigger('console:message', { consoleline: '[Builder] ' + data.fqn + ', state: ' + data.state });
	        		dispatcher.trigger('builder:state', data);
	    		});
	    		this.socket.on('console',function(data){
	        		console.log('[Console] ' + data.consoleline);
	        		dispatcher.trigger('console:message', data);
	    		});
	    		this.socket.on('status', function(data) {
	        		dispatcher.trigger('status:system', data);   		
	    		});
    		
    		
	    		/* dispatcher routes to send stuff back to the server from other places in the code */
	    		dispatcher.on('command:send', function(data) {
	    			lthis.socket.emit('echo', data);
	    		});
	    		
			},
			dashboard: function() {
				var $container = $('#content_area');
				$container.empty();
				$container.append(this.dashboardView.render().el);
				dispatcher.trigger('page:dashboard');
			},
			settings: function() {
				var $container = $('#content_area');
				$container.empty();
				$container.append(this.settingsView.render().el);
				dispatcher.trigger('page:settings');
			},
			packages: function() {
				var $container = $('#content_area');
				$container.empty();
				$container.append(this.packagesView.render().el);
				dispatcher.trigger('page:packages');
			}
		});
})(jQuery);
