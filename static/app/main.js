/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

window.username = null;
	
var dispatcher = _.clone(Backbone.Events);


function prettysize(bytes) {
	if (bytes == 0) {
		return 'Zero';
	}
	
	else if (bytes >= 1000000000000) {
		//tb
		var terabytes =  bytes / 1000000000000;
		return terabytes.toFixed(1) + ' TB';
	}
	else if (bytes >= 1000000000) {
		//gb
		var gigabytes = bytes / 1000000000;
		return gigabytes.toFixed(1) + ' GB';
	}
	else if (bytes >= 1000000) {
		//mb
		var megabytes = bytes / 1000000;
		return megabytes.toFixed(1) + ' MB';
	}
	else if (bytes >= 1000) {
		//kb
		var kilobytes = bytes / 1000;
		return  kilobytes.toFixed(1) + ' KB';
		
	}
	else {
		return bytes.toFixed(1)  + ' B';
	}	
}

(function($) {

	
	$(function() {
		console.log('Initializing new backbone router');
		window.App = new PlugBuild;
		Backbone.history.start();
	});
	
})(jQuery);