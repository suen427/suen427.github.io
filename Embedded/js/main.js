$('.navbar [href^=#]').click(function(e){
	e = e || window.event;
	if ( e.preventDefault) {
		e.preventDefault();
	} else {
		e.cancelable = true;
	}

	var div = $(this).attr('href');
	if(div == '#') {
		return;
	}
	$('html, body').animate({ 
		scrollTop: $(div).position().top
	}, 'slow');
});

$('.readOnline').click(function(e){
	e.preventDefault();
	var target = e.target;
	var url ='js/pdfJS/web/viewer.html?file='+target.href;
	$('#viewer > iframe')[0].src = url;
	$('#viewer').show();
});
$('.remove').click(function(e){
	$('#viewer > iframe')[0].src='';
	$('#viewer').hide();
});

var fullscreen = false;
$('#pdf > .full-screen').click(function(e){
	var pdf = $('#pdf');
	if( !fullscreen ){
		pdf.css('position','fixed');
		pdf.css('height','100%');
		pdf.css('z-index','9999');
		fullscreen = true;
	}else{
		pdf.css('position','relative');
		pdf.css('height','600px');
		pdf.css('z-index','100');
		fullscreen = false;
	}
})