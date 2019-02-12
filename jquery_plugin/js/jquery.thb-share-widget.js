(function ($) {

	$.fn.THBShareWidget = function (options) {

		// Establish our default settings
		var settings = $.extend({}, options);


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

			var template = {
				container: `
				<div class="tb-share-dialog-box" id="tb-share-dialog" style="display:none;">
				<div id="tb-share-canvas-card">
				<div class="tb-card-header">
					<i class="fa fa-times tb-share-dialog-close tb-share-control" aria-hidden="true"></i>
					<i class="fa fa-arrow-left tb-share-dialog-back tb-share-control" aria-hidden="true"></i>
	
					<i id="btnZoomIn" class="fas fa-search-plus tb-share-control"></i>
	
					<i id="btnZoomOut" class="fas fa-search-minus tb-share-control"></i>
	
					<i id="btnResetZoom" class="tb-share-control">Reset Zoom</i>
	
				</div>
				<div class="tb-card-content tb-canvas-scroll" data-simplebar>
					<div class="tb-share-canvas-container">
							<div id="tb-share-text-controls" style="display:none;">
									
								<div id="tb-color-picker" class="colorPickSelector"></div>
			
								<select id="tb-font-family" onChange="applyStyle('font-family', this.value, 'selection')">
								</select>
			
								<select id="tb-font-size" onChange="applyStyle('font-size', this.value)">
								</select>
			
								<span class="alignment-div">
									<a style="cursor:pointer;" onClick="applyStyle('text-align', 'center', 'selection')">
										<i id="txt-align-left" class="fa fa-align-left text-style" aria-hidden="true" style="font-size:14px;margin:10px;"></i>
									</a>
									<a style="cursor:pointer;" onClick="applyStyle('text-align', 'right', 'selection')">
										<i id="txt-align-center" class="fa fa-align-center text-style" aria-hidden="true" style="font-size:14px;margin:10px;"></i>
									</a>
									<a style="cursor:pointer;" onClick="applyStyle('text-align', 'left', 'selection')">
										<i id="txt-align-right" class="fa fa-align-right text-style" aria-hidden="true" style="font-size:14px;margin:10px;"></i>
									</a>
								</span>
								<a style="cursor:pointer;" onClick="applyStyle('font-weight', 'bold', 'selection')">
									<i id="txt-bold" class="fa fa-bold text-style" aria-hidden="true" style="font-size:14px;margin:10px;"></i>
								</a>
								<a style="cursor:pointer;" onClick="applyStyle('font-style', 'italic', 'selection')">
									<i id="txt-italic" class="fa fa-italic text-style" aria-hidden="true" style="font-size:14px;margin:10px;"></i>
								</a>
							</div>
							
						<canvas id="tb-share-canvas"></canvas>
					</div>
				</div>
	
				<input class="tb-share-bg-color-picker" />
	
				<div class="tb-share-bg-filters"></div>
	
				<div class="tb-card-footer">
					<div class="tb-share-control-container">
						<div id="tb-search-tags"></div>
						<div>OR</div>
						<input type="search" id="tb-txtsearch" name="txtsearch" placeholder="Search Background Image..." />
						<button type="submit" id="tb-btnsearch">Search</button>
						<div id="tb-bg-search-results">
	
						</div>
					</div>
				</div>
			</div>
				</div>
				`,
				platformcard: `
				<div id="tb-share-platform-card" class="tb-card">
					<div class="tb-share-platform-list">
						<div class="tb-share-platform-icon" data-platform="ge">General </div>
						<div class="tb-share-platform-icon" data-platform="fb">FB </div>
						<div class="tb-share-platform-icon" data-platform="in">Instagram </div>
						<div class="tb-share-platform-icon" data-platform="tw">Twitter</div>
						<div class="tb-share-platform-icon" data-platform="pi">Pintrest</div>
						<div class="tb-share-platform-icon" data-platform="gp">Google Plus</div>
					</div>
		        </div>
				`,
			}

			function init() {
				//Add share widget to html
				$('body').append(template.platformcard);
				$('body').append(template.container);
				$(document).mouseup(function(e) 
				{
				    var container = $("#tb-share-platform-card");
				
				    // if the target of the click isn't the container nor a descendant of the container
				    if (!container.is(e.target) && container.has(e.target).length === 0) 
				    {
				        container.hide();
				    }
				});
			}

			init();

		});
	}

}(jQuery));

