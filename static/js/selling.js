$(document).ready(function() {
	refresh_comments();

	$("#buythis").click(function(){
		var id = $(this).attr("name");
		console.log(id);
		$.ajax({
			url: "/buy?item_id=" + id,
			type: "POST",
			success: function(response){
				//console.log(response);
				if (response == "Not Reg") {
					console.log("not reg");
					// TODO: 弹窗
					$('#basesigninSuc').attr("action", "/signin?item_id="+id);
					
					$('#baseSignin').click();
				}
				if (response == "Not Enough") {
					alert("Not sufficient funds. Please Check your account balance.");
					//window.location = '/userinfo'
				}
				if (response == "Reg and Bought") {
					window.location = '/';
				}

			}
		});
	});

	$('#sellingChat').click(function(){
		var item_id = $(this).attr("name");
		var id = $('#selling').attr("name");
		//console.log("item_id is " + item_id + " id is " + id);
		$.ajax({
			url: "/sendmessage?sender=" + id + "&item_id=" + item_id,
			type: "GET",
			success: function(response){
				//console.log("send response " + response);
				if (response == "Not Reg") {
					console.log("not reg");
					// TODO: 弹窗
					$('#basesigninSuc').attr("action", "/signin?item_id="+item_id);
					
					$('#baseSignin').click();
				}else{
					var res = JSON.parse(response);
					//console.log('res is ' + response);
					var receiver = res.receiver;
					window.location = '/send?receiver='+ receiver;
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
