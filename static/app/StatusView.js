/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	window.StatusView = Backbone.View.extend({
		tagName: 'div',
		className: 'two-thirds column statusbox',
		
		
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
			/*var w = 400;
    		var h = 400;
    		var r = Math.min(w, h) / 2;
    		var data = d3.range(10).map(Math.random);
    		var color = d3.scale.category20();
    		var donut = d3.layout.pie();
    		var arc = d3.svg.arc().innerRadius(r * .6).outerRadius;


			var graph = document.createDocumentFragment();
			var vis = d3.select(graph)
  				.append("svg")
    			.data([data])
    			.attr("width", w)
    			.attr("height", h);

			var arcs = vis.selectAll("g.arc")
    			.data(donut)
  				.enter().append("g")
    			.attr("class", "arc")
    			.attr("transform", "translate(" + r + "," + r + ")");

			arcs.append("path")
    			.attr("fill", function(d, i) { return color(i); })
    			.attr("d", arc);

			arcs.append("text")
    			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    			.attr("dy", ".35em")
    			.attr("text-anchor", "middle")
    			.attr("display", function(d) { return d.value > .15 ? null : "none"; })
    			.text(function(d, i) { return d.value.toFixed(2); });
		
		
      		this.$('#cpu-chart').append(graph.cloneNode(true));*/
			return this;
		}
	});
})(jQuery);