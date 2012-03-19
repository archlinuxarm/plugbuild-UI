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
			this.adminBar		= new AdminBar();
			this.consoleView    = new ConsoleView();
			
			var $adminBarContainer = $('#adminbar');
			$adminBarContainer.append(this.adminBar.render().el);
			
			var lthis = this;
			// done with setup of backbone stuff so we can setup the websocket now
		    this.socket = io.connect('https://archlinuxarm.org:7050', {secure: true});
    		this.socket.on('connect', function () {
        		console.log('socket.io connected');
    		});
			this.socket.on('disconnect',function(){
        		console.log('socket.io closed');
    		});
     		this.socket.on('init',function(data) { 
        		console.log("Received initialization data from builder");
        		
        		//grab the username out of the response and ship it around
        		var user = data.user;
        		window.username = user;
        		lthis.adminBar.username = user;
        		lthis.adminBar.render();

				var builder_snapshot = [];
				
				for (var key in data.builders) {
					
        	        var nbuilder = data.builders[key];
        	        console.log('Processing builder: ' + nbuilder.fqn);
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
        		console.log('Package update: ' + data.package);
        		dispatcher.trigger('package:update', data);
    		});
    		this.socket.on('builder',function(data){
        		console.log('Builder: ' + data.fqn + ', state: ' + data.state);
        		dispatcher.trigger('builder:state', data);
    		});
    		this.socket.on('console',function(data){
        		console.log('Console line: ' + data.consoleline);
        		dispatcher.trigger('console:message', data);
    		});
    		this.socket.on('status', function(data) {
         		console.log('Status heartbeat: ' + data);
        		dispatcher.trigger('status:system', data);   		
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