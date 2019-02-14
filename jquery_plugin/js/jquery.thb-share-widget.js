(function ($) {

	$.fn.THBShareWidget = function (options) {

		// Establish our default settings
		var settings = $.extend({}, options);

		$(document).mouseup(function(e) 
		{
			var container = $("#tb-share-platform-card");
		
			// if the target of the click isn't the container nor a descendant of the container
			if (!container.is(e.target) && container.has(e.target).length === 0) 
			{
				container.hide();
			}
		});

		return this.each(function () {

			$(this).text(settings.text);

			$(this).on('click', function (event) {
				console.log('clicked', event.target);
				var position = $(this).position();
				var targetHeight = $(this).height();
				var targetWidth = $(this).width();
				var docWidth = $( document ).width();

				$("#tb-share-platform-card").parent().css({position: 'relative'});
				$("#tb-share-platform-card").show();

				var cardWidth = $("#tb-share-platform-card").width();
				
				if(docWidth < (position.left+cardWidth) ){
					$("#tb-share-platform-card").css({top: position.top+targetHeight, left: (position.left-cardWidth)+targetWidth, position:'absolute'});
				} else {
					$("#tb-share-platform-card").css({top: position.top+targetHeight, left: position.left, position:'absolute'});
				}
			});
		});
	}

}(jQuery));

