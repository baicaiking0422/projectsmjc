$(document).ready(function() {
	$('#message').change(function(){
		var text = $(this).val();
		if (text != null){
			$('#send').prop('disabled', false);
		}
	});

	$('#send').click(function(){
		var sender = $('#msgPage').attr("name");
		var receiver = $(this).attr("name");
		var msg = $('#message').val();
		$.ajax({
			url: "/send",
			type: "POST",
			data: {'sender' : sender, "receiver": receiver, "message":msg},
			success: function(response){
				window.location = '/userinfo?username=' + sender;
			}
		})
	})

});

