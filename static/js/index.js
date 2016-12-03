$(document).ready(function(){
	//var curPage = 1;
	getAllItems(1);
	createAllPage();

 	$('#indexSearchSubmit').click(function(){
 		var search = $('#indexSearch').val();
 		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
 		getItems(price, size, tag, search, 1);
 		createSubPage(price, size, tag, search);
 	})


	$('#price').change(function(){
		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
		var search = $('#indexSearch').val();
		getItems(price, size, tag, search, 1);
		createSubPage(price, size, tag, search);
	});

	$('#size').change(function(){
		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
		var search = $('#indexSearch').val();
		getItems(price, size, tag, search, 1);
		createSubPage(price, size, tag, search);
	});

	$('#menu').change(function(){
		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
		var search = $('#indexSearch').val();
		getItems(price, size, tag, search, 1);
		createSubPage(price, size, tag, search);
	});


 	// $('#next').click(function(){
 	// 	var totalPage = 3;
 	// 	if (curPage < totalPage){
 	// 	curPage += 1;
 	// 	console.log("in next " + curPage);}
 	// });

 	//  $('#prev').click(function(){
 	//  	if (curPage > 1){
 	// 	curPage -= 1;

 	// 	console.log("in prev "+ curPage);
 	// }
 	// });

	function getAllItems(page){
		var username = $("#session").attr("name");	
		$.ajax({
			url: "/items?page=1&price=all&size=all&tag=All&search="+ '&buyer=' + username,
			type: "GET",
			//data: {'buyer': username},
			success: function(response){
				//console.log(create_page(JSON.parse(response)));
				var node = create_result(JSON.parse(response));
				var parent = $('#indexResult');
				parent.text("");
				parent.append(node);
			}
		});
	};

	function getItems(price, size, tag, name, page){
		var username = $("#session").attr("name");
		$.ajax({
			url:'items?page=' + page + '&price=' + price + '&size=' + size + '&tag=' + tag + '&search=' + name+ '&buyer=' + username,
			type: "GET",
			//data: {'buyer': username},
			success: function(response){
				var node = create_result(JSON.parse(response));
				var parent = $('#indexResult');
				parent.text("");
				parent.append(node);
				//var page = $('#indexPage');
			} 
		});
	}

	function createAllPage(){
		var username = $("#session").attr("name");
		$.ajax({
			url: "/items?price=all&size=all&tag=All&search="+ '&buyer=' + username,
			type: "GET",
			//data: {'buyer': username},
			success: function(response){
				//console.log(create_page(JSON.parse(response)));
				var totalPage = create_page(JSON.parse(response));
				//var curPage = 1;
				//checkPage(curPage, totalPage);
				var page = $('#indexPage');
				page.text("");
				page.append(totalPage);
			}
		});
	};

	function createSubPage(price, size, tag, search){
		var username = $("#session").attr("name");
		$.ajax({
			url:'items?price=' + price + '&size=' + size + '&tag=' + tag + '&search=' + search + '&buyer=' + username,
			type: "GET",
			success: function(response){
				var totalPage = create_page(JSON.parse(response));
				var page = $('#indexPage');
				page.text("");
				page.append(totalPage);
			} 
		});
	}

		// select diff query!!!!!!to display!!!
	function pageNum(items){
		var pageNum = 0;
		for (var i = 0; i < items.length; i=i+9){
			pageNum += 1;
		}
		return pageNum;
	}

	function create_page(items){
		var totalPage = pageNum(items);
		var page = document.createElement("div");
		page.className = "btn-group";
		//page.role = "role";
		for (let i = 1; i <= totalPage; i++){
			let node = document.createElement("button");
			node.type="button";
			node.className = "btn btn-default";
			node.innerHTML = i;
			node.onclick = function() {
				pageClick(i);
			}
			page.appendChild(node);
		}
		return page;
	}

	function pageClick(i){
		var search = $('#indexSearch').val();
 		var price = $('#price').val();
		var size = $('#size').val();
		var tag = $('#tag').val();
 		getItems(price, size, tag, search, i);
	}


	function create_result(items){
		var div = document.createElement("div");
		if (items.length == 0){
			let par = document.createElement("div");
			par.className = "alert alert-info";
			par.role="alert";
			par.innerHTML = "There are no items satisfiable for current search criteria";
			div.appendChild(par);
		}
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
				link.href = "/good?id=" + items[index].id;
				link.className = "thumbnail";
				if (pictureName == null){
					let imgPlaceHolder = document.createElement("img");
					imgPlaceHolder.src = "img/item.jpg";
					//imgPlaceHolder.className = "item col-sm-4";
					link.appendChild(imgPlaceHolder);
				}else{
					let img = document.createElement("img");
					img.src = "img/" + pictureName;
					//img.className = "item col-sm-4";
					link.appendChild(img);
				}
				let name = document.createElement("p");
				name.innerHTML = items[index]["name"];
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