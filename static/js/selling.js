$(document).ready(function() {
	refresh_comments();
	//setInterval(15000,refresh_comments);

	//But item
	//Chat with seller
});

function refresh_comments(){
	var container = $("#commentsforseller");
	//container.empty();
	var form = $('#read_comments');
	$.ajax({
		dataType:'json',
		url: form.attr('action'),
		type: form.attr('method'),
		success: function(comments){
			comments.forEach(function(comment){
				$('<dt/>').html('Comment on ' + comment.name + ' sold by '+ 
					comment.username + ' '+ comment.days_ago + 'days ago').appendTo(container);
				$('<dd/>').html(comment.comments).appendTo(container);
			});
		},
		error: function(jqxhr,status){
			console.log('Error: '+ status);
		}
	});
}