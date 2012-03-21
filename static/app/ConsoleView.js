(function($) {

	window.ConsoleView = Backbone.View.extend({
		tagName: 'div',
		id: 'console',
    
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#console-template').html());
			this.collection	= new ConsoleMessages();
			//this.collection.bind('reset', this.render);
			//this.collection.bind('add', this.render);
			this.collection.reset();
			
			var lthis = this;
			
			dispatcher.on('console:message',function(message) {
				console.log('Console view got message');
				lthis.collection.create(message);
      			
      			var li = document.createElement('li');
				li.setAttribute('class','console-line');
				
				var message = document.createTextNode(message.consoleline);
				li.appendChild(message);
		
      		
      			lthis.$('#console-list').append(li);
      			lthis.$('#console-display').prop({ scrollTop: lthis.$('#console-display').prop("scrollHeight") });
			});
		},
		events: {
            "click #reveal-button": "reveal"
        },
        nop: {
        	//
        },
		reveal: function () {
			console.log("swap");
			//this.$('#reveal-button').css({ WebkitTransform: 'rotate(' + 180 + 'deg)'});
			if ($("#console-display").is(":hidden")) {
				console.log("showing");
				//$('#controlbutton').addClass('selected');
				$("#console-display").slideDown({
					duration:500,
					easing:"swing",
					complete:function(){
						//alert("complete!");
					}
				});
			} else {
				//$('#controlbutton').removeClass('selected');
				console.log("hiding");
				$("#console-display").slideUp({
					duration:500,
					easing:"swing",
					complete:function(){
						//alert("complete!");
					}
				});
			}            
			
			
			
        },
		render: function() {
			var lthis = this;
			console.log('rendering console');
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
      	
			return this;
		}
	});	
})(jQuery);