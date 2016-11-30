$(document).ready(function() {
 //  	$('.rating input[type="radio"]').hover(function() {
	//     $(this).nextAll('span').removeClass().addClass('jshoverNext');
	//     $(this).next('span').removeClass().addClass('jshover');
	//     $(this).prevAll('span').removeClass().addClass('jshover');
	// },function() {
	//     	$('.rating input[type="radio"] + span').removeClass();
	// });
	$("#make_comment").submit(function(evt){
		var form = $(this);
		evt.preventDefault();

		var rating_val = $('.rating input[type="radio"]:checked').val();
		var text = $('textarea#area').val();
		console.log(rating_val);
		console.log(text);

		$.ajax({
			url: form.attr('action'),
      		type: form.attr('method'),
      		dataType: "json",
      		data: {"rating":rating_val, "comment":text}
      		// error: function(jqxhr, status) {
        // 		console.log('Error: ' + status);
      		// }
		});

	});

});

