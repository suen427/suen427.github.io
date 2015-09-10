$( document ).ready(function() {
	// init Masonry
	var $works = $('.works').masonry({
		// options...
		itemSelector: '.work'
	});
	// layout Masonry after each image loads
	$works.imagesLoaded().progress( function() {
		$works.masonry('layout');
	});
});