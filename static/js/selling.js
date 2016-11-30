$(document).ready(function() {
	refresh_comments();

	$("#buythis").click(function(){
		var id = $(this).attr("name");
		console.log(id);
		$.ajax({
			url: "/buy?item_id=" + id,
			type: "POST",
			success: function(response){
				console.log(response);
				if (response == "Not Reg") {
					console.log("not reg");
					// TODO: 弹窗
				}
			}
		});
	});

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