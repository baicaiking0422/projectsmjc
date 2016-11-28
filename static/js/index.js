$(document).ready(function(){
	
	getAllItems();
	
	$('#price').change(function(){
		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
		getItems(price, size, tag);
	});

	$('#size').change(function(){
		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
		getItems(price, size, tag);
	});

	$('#menu').change(function(){
		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
		getItems(price, size, tag);
	})
	function getAllItems(){
		$.ajax({
			url: "/items?price=all&size=all&tag=All",
			type: "GET",
			success: function(response){
				var node = create_result(JSON.parse(response));
				var parent = $('#indexResult');
				parent.append(node);
			}
		})
	};

	function getItems(price, size, tag){
		$.ajax({
			url:'items?price=' + price + '&size=' + size + '&tag=' + tag,
			type: "GET",
			success: function(response){
				var node = create_result(JSON.parse(response));
				var parent = $('#indexResult');
				parent.text("");
				parent.append(node);
			} 
		})
	}

	function create_result(items){
		var div = document.createElement("div");
		for (let i = 0; i < items.length; i = i + 3){
			let par = document.createElement("div");
			par.className = "row";
			par.id = "items";
			for (let j = 0; j < 3; j++){
				let index = i + j;
				if (index < items.length){
				let pictureName = items[index]["picture"];
				let node = document.createElement("div");
				node.className = "item col-sm-4";
				let link = document.createElement("a");
				// give link to each goods !!!!!!!

				link.href = "#";
				link.className = "thumbnail";
				let img = document.createElement("img");
				img.src = "img/" + pictureName + ".jpg";
				let name = document.createElement("p");
				name.innerHTML = items[index]["name"];
				link.appendChild(img);
				link.appendChild(name);
				node.appendChild(link);
				par.appendChild(node);
			}
			}
			div.appendChild(par); 
		}
		return div;
	}
});