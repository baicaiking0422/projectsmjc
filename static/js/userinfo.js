$(document).ready(function() {
	$("#editinfo").click(function(){
		var name = $(this).attr('name');
		var div = "<ul class='list-group'> Please click to change info. ";
		var b1 = "<li id='editPassword' class='list-group-item row'> Edit Password";
		var form1 = "<form action='/editinfo?username=" + name + "' method='post' class='form-horizontal row'>" +
					"<div class='form-group'>" +  
					"<label class='col-sm-2 control-label' for='pw'>New Password</label>" +
					"<div class='col-sm-4'><input type='password' name='pw' class='form-control' id='pw' required></div>" +
					"<label class='col-sm-2 control-label' for='pw_conf'>Confirmation</label>" +
					"<div class='col-sm-4'><input type='password' name='pw_conf' class='form-control' id='pw_conf' required></div></br>" +
					"<button type='submit' class='btn btn-default btn-sm'>EDIT</button></form></li>";
		var b2 = "<li id='editEmail' class='list-group-item row'> Edit Email Address";
		var form2 = "<form action='/editinfo?username=" + name + "' method='post' class='form-horizontal row'>" +
					"<div class='form-group'>" +  
					"<label class='col-sm-2 control-label' for='email'>New Email</label>" +
					"<div class='col-sm-4'><input type='text' name='email' class='form-control' id='email' required></div>" +
					"<button type='submit' class='btn btn-default btn-sm'>EDIT</button></form></li>";
		var b3 = "<li id='editPhone' class='list-group-item row'> Edit Phone Number";
		var form3 = "<form action='/editinfo?username=" + name + "' method='post' class='form-horizontal row'>" +
					"<div class='form-group'>" +  
					"<label class='col-sm-2 control-label' for='phone'>New Phone Number</label>" +
					"<div class='col-sm-4'><input type='text' name='phone' class='form-control' id='phone' required></div>" +
					"<button type='submit' class='btn btn-default btn-sm'>EDIT</button></form></li>";
		var re = div + b1 + form1 + b2 + form2 + b3 + form3 + '</ul>'
		$("#result").html(re);
	});



		$("#soldhistory").click(function(){
		var name = $(this).attr("name");
		$.ajax({
			url: "/sold?username=" + name,
			type: "get",
			dataType: "json",
			success: function(response){
				console.log(response);
				tableR = "";
                tableR += "<table  class=\"table table-bordered  table-hover\">";
                tableR += "<tr class='warning'><td  align='center'>name</td><td align='center'>price</td><td align='center'>size</td>"
                       + "</tr>";
                for (var i = 0; i < response["goods"].length; i++) {
                	tableR = tableR + "<tr>"
                            + "<td align='center'>" + response["goods"][i].name
                            + "</td><td align='center'>" + response["goods"][i].price
                            + "</td><td align='center'>" + response["goods"][i].size
                            + "</td></tr>";
                }
                tableR = tableR + "</table>";
                $("#result").html(tableR);

			}
		});
	});

	$("#purchasehistory").click(function(){
		var name = $(this).attr("name");
		console.log(name);
		$.ajax({
			url: "/purchase?username=" + name,
			type: "get",
			dataType: "json",
			success: function(response){
				$("#result").html("");
				//console.log(response);
				tableR = "";
                tableR += "<table  class=\"table table-bordered  table-hover\">";
                tableR += "<tr class='warning'><td  align='center'>name</td><td align='center'>price</td><td align='center'>size</td>"
                       + "</tr>";
                for (var i = 0; i < response["goods"].length; i++) {
                	tableR = tableR + "<tr>"
                            + "<td align='center'>" + response["goods"][i].name
                            + "</td><td align='center'>" + response["goods"][i].price
                            + "</td><td align='center'>" + response["goods"][i].size
                            + "</td></tr>";
                }
                tableR = tableR + "</table>";
                $("#result").html(tableR);

			}
		});
	});

		$("#rate").click(function(){
		var name = $(this).attr("name");
		console.log(name);
		$.ajax({
			url: "/rate?username=" + name,
			type: "get",
			dataType: "json",
			success: function(response){
				$("#result").html("");
				console.log(response);
				tableR = ""
                tableR += "<table  class=\"table table-bordered  table-hover\">";
                tableR += "<tr class='warning'><td  align='center'>name</td><td align='center'>price</td><td align='center'>size</td><td align='center'>rate now</td>"
                       + "</tr>";
                for (var i = 0; i < response["goods"].length; i++) {
                	tableR = tableR + "<tr>"
                            + "<td align='center'>" + response["goods"][i].name
                            + "</td><td align='center'>" + response["goods"][i].price
                            + "</td><td align='center'>" + response["goods"][i].size
                            + "</td>" + "<td align='center' class='rate'><a href='/feedback?item_id="+ response["goods"][i].id + "'><input type='button' value='rate'></a></td>";
                }
                tableR = tableR + "</table>";
                $("#result").html(tableR);

			}
		});
	});



	$("#wallet").click(function(){
		var name = $(this).attr("name");
		$.ajax({
			url: "/wallet?username=" + name,
			type: "GET",
			success: function(response){
				var c = JSON.parse(response).currency;
				var re = "<div class='col-md-6'> Remain Balance " + c + "</div></br></br>";
				var form = "<form action='/wallet?username=" + name + "' method='post' class='form-horizontal row'>" +
							"<div class='form-group'>" +  
							"<label class='col-sm-4 control-label' for='charging'>Charge  $</label>" +
							"<div class='col-sm-2'><input type='text' name='charging' class='form-control' id='charging' pattern='^[0-9]+$' required></div>" +
							"<button type='submit' class='btn btn-default col-sm-3'>Charge!</button></form>";
            	$("#result").html(re+form);
			}
		});
		});
	});


	$("#messages").click(function(){
		var name = $(this).attr("name");
		$.ajax({
			url: "/message?username=" + name,
			type: "GET",
			success: function(response){
				var re = loadMsg(JSON.parse(response));
            	$("#result").html(re);
			}
		});
	});

function loadMsg(msgs){

	if (msgs.length > 0){
	tableR = "";
	tableR += "<table  class=\"table table-bordered  table-hover\">";
    tableR += "<tr class='warning'><td  align='center'>name</td><td align='center'>message</td><td align='center'>Reply</td>"
                       + "</tr>";
	for (let i = 0; i < msgs.length; i ++){
		tableR = tableR + "<tr>" + "<td align='center'>" + msgs[i].name + "</td><td align='center'>"
		        + msgs[i].message + "</td><td align='center'>";
		let button = "<button class='btn btn-default btn-sm'><a href='/send?receiverName=" + msgs[i].name + "'> Reply</a></button>";
		tableR = tableR + button + "</td>" + "</tr>";
	} 
	tableR = tableR + "</table>";
	return tableR;
}
	else{
		return "<div class='alert alert-info col-md-4' role='alert'> No messages </div>";
	}
}