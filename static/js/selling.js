$(document).ready(function() {
	refresh_comments();
	setInterval(15000,refresh_comments);

	//But item
	$("#buythis").click(function(){

	});
	//Chat with seller
	$("#chatwith").click(function(){

	});
});

function refresh_comments(){
	var container = $("#commentsforseller");
	//container.empty();
	$.ajax({
		dataType:'json',
		url: '/comments',
		success: function(comments){

		},
		error: function(jqxhr,status){
			console.log('Error: '+ status);
		}
	});
}