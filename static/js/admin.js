$(document).ready(function(){
    var adminUser = $('#usersCol').attr("name");
    // booleans for button onclicks. The boolean value of the buttons becomes
    // false when the button is being pressed down, and true when the buttons
    // are being released
    var add_user_but = false;
    var edit_user_but = false;
    var show_users_but = false;
    var add_item_but = false;
    var show_items_but = false;
    var delete_user_but = false;
    var delete_item_but = false;
    var edit_item_but = false;

    // Hide all display elements when page first loads
    $("#add_user_display").hide();
    $("#edit_user_option").hide();
    $("#show_users_display").hide();
    $("#add_item_display").hide();
    $("#show_items_display").hide();
    $("#delete_user_display").hide();
    $("#delete_item_display").hide();
    $("#edit_item_option").hide();


    //--------------------------USERS SECTION----------------------------------
	
    // after "add user" button is clicked, the corresponding form appears on 
    // the right
	$("#add_user_but").click(function() {
        $.ajax({
            url: "/admin?username=" + adminUser,
            type: "GET",
            success: function(response) {
                // 'add user' button is pressed down
                if (add_user_but == false) {
                    // release the other buttons and hide unnecessary elements
                    $("#edit_user_option").hide();
                    $("#show_users_display").hide();
                    $("#add_item_display").hide();
                    $("#show_items_display").hide();
                    $("#delete_user_display").hide();
                    $("#delete_item_display").hide();
                    $("#edit_item_option").hide();
                    edit_user_but = false;
                    show_users_but = false;
                    add_item_but = false;
                    show_items_but = false;
                    delete_user_but = false;
                    delete_item_but = false;
                    edit_item_but = false;

                    // display the form
                    $("#add_user_display").show();
                    add_user_but = true;
                } else { // 'add user' button is released
                    // hide the form
                    add_user_but = false;
                    $("#add_user_display").hide();
                }

            }
        });
    });

    
    // Add the new user after the "add" button in add user form is pressed
    $("#submit_user_but").click(function(e) {
        e.preventDefault();
        var username = $("#username2").val();
        var password = $("#password2").val();
        var email = $("#email_address2").val();
        var phone = $("#phone2").val();
 
        $.ajax({
            url: '/admin?username=' + username + '&password=' + password + 
                 '&email=' + email + '&phone=' + phone,
            type: "POST",
           // beforeSubmit: $("#add_user_form").validate();
            success: function(response) { 
                var node = JSON.parse(response);
                alert(node.status);
            }
        });
    });


    // after "Edit user information" button is clicked, the corresponding form 
    // appears on the right
    $("#edit_user_info_but").click(function() {
        $.ajax({
            url: "/admin?username=" + adminUser,
            type: "GET",
            success: function(response) {
                // 'edit user' button is pressed down
                if (edit_user_but == false) {
                    // release the other buttons and hide unnecessary elements
                    add_user_but = false;
                    show_users_but = false;
                    add_item_but = false;
                    show_items_but = false;
                    delete_user_but = false;
                    delete_item_but = false;
                    edit_item_but = false;
                    $("#add_user_display").hide();
                    $("#show_users_display").hide();
                    $("#add_item_display").hide();
                    $("#show_items_display").hide();
                    $("#delete_user_display").hide();
                    $("#delete_item_display").hide();
                    $("#edit_item_option").hide();

                    // display the form
                    $("#edit_user_option").show();
                    edit_user_but = true;
                } else { // 'edit user' button is released
                    // hide the form
                    edit_user_but = false;
                    $("#edit_user_option").hide();
                }

            }
        });
    });


    // Edit the user's info after "edit" is pressed
    $("#edit_user_but").click(function(e) {
        e.preventDefault();
        var user = $("#username3").val().trim();
        var new_username = $("#new_username").val().trim();
        var new_password = $("#new_password").val().trim();
        var new_email = $("#new_email_address").val().trim();
        var new_phone = $("#new_phone").val().trim();
        
        // ensure the name of the user whose content needs modification is 
        // entered 
        if (user == '') {
            alert("Enter the name of the user that needs modification.");
        } else {
            $.ajax({
                url: '/admin?user=' + user + '&username=' + new_username + 
                     '&password=' + new_password + '&email=' + new_email + 
                     '&phone=' + new_phone,
                type: "POST",
               // beforeSubmit: $("#add_user_form").validate();
                success: function(response) { 
                    alert(response);
                }
            });
        }
    });


    // after "show all users" button is clicked, the name of all users  
    // appear on the right
    $("#display_users_but").click(function() {
        $.ajax({
            url: "/admin/allUsers?username="+adminUser,
            type: "GET",
            success: function(response) {
                // 'show all user' button is pressed down
                if (show_users_but == false) {
                    // release the other buttons and hide unnecessary elements
                    add_user_but = false;
                    $("#add_user_display").hide();
                    edit_user_but = false;
                    $("#edit_user_option").hide();
                    add_item_but = false;
                    $("#add_item_display").hide();
                    show_items_but = false;
                    $("#show_items_display").hide();
                    delete_user_but = false;
                    $("#delete_user_display").hide();
                    delete_item_but = false;
                    $("#delete_item_display").hide();
                    edit_item_but = false;
                    $("#edit_item_option").hide();

                    // display the form
                    $("#show_users_display").show();
                    displayAllUsers(response);
                    show_users_but = true;
                } else { // 'show all user' button is released
                    // hide the form
                    show_users_but = false;
                    $("#show_users_display").hide();
                }
            }
        });
    });


    // after "Delete User" button is clicked, the corresponding text field 
    // appears on the right
    $("#delete_user_but").click(function() {
        $.ajax({
            url: "/admin?username="+ adminUser,
            type: "GET",
            success: function(response) {
                // 'delete user' button is pressed down
                if (delete_user_but == false) {
                    // release the other buttons and hide unnecessary elements
                    $("#edit_user_option").hide();
                    $("#show_users_display").hide();
                    $("#add_user_display").hide();
                    $("#show_items_display").hide();
                    $("#add_item_display").hide();
                    $("#delete_item_display").hide();
                    $("#edit_item_option").hide();
                    add_item_but = false;
                    edit_user_but = false;
                    show_users_but = false;
                    add_user_but = false;
                    show_items_but = false;
                    delete_item_but = false;
                    edit_item_but = false;

                    // display the form
                    $("#delete_user_display").show();
                    delete_user_but = true;
                } else { // 'delete user' button is released
                    // hide the form
                    delete_user_but = false;
                    $("#delete_user_display").hide();
                }
            }
        });
    });


    // after "Delete" button is clicked, the corresponding text field 
    // appears on the right
    $("#delete_user_submit").click(function(e) {
        e.preventDefault();
        var user = $("#delete_user").val().trim();
    
        if (user == '') {
            alert("Enter the name of the user to be deleted.");
        } else {
            $.ajax({
                url: '/admin',
                type: "POST",
                data: {'deleteUser': user},
                success: function(response) {
                    alert(response);
                }
            });
        }
    });
    

    //--------------------------GOODS SECTION----------------------------------

    // after "add Item" button is clicked, the corresponding form appears on 
    // the right
    $("#add_item_but").click(function() {
        $.ajax({
            url: "/admin?username="+adminUser,
            type: "GET",
            success: function(response) {
                // 'add item' button is pressed down
                if (add_item_but == false) {
                    // release the other buttons and hide unnecessary elements
                    $("#edit_user_option").hide();
                    $("#show_users_display").hide();
                    $("#add_user_display").hide();
                    $("#show_items_display").hide();
                    $("#delete_user_display").hide();
                    $("#delete_item_display").hide();
                    $("#edit_item_option").hide();
                    edit_user_but = false;
                    show_users_but = false;
                    add_user_but = false;
                    show_items_but = false;
                    delete_user_but = false;
                    delete_item_but = false;
                    edit_item_but = false;

                    // display the form
                    $("#add_item_display").show();
                    add_item_but = true;
                } else { // 'add item' button is released
                    // hide the form
                    add_item_but = false;
                    $("#add_item_display").hide();
                }
            }
        });
    });

    

    // Add the new item after the "add" button in add item form is pressed
    $("#submit_item_but").click(function(e) {
        e.preventDefault();
        var name = $("#name2").val().trim();
        var price = $("#price2").val().trim();
        var size = $("#size2").val();
        var tag = $("#tag2").val();
        var seller = $("#seller2").val().trim();
        var description = $("#description2").val().trim();
        
        if (name == '') { // username is empty
            alert("Item name has to be filled.");
        } else {
            $.ajax({
                url: '/admin?name=' + name + '&price=' + price + 
                     '&size=' + size + '&tag=' + tag + '&seller=' + seller + 
                     '&description' + description,
                type: "POST",
               // beforeSubmit: $("#add_user_form").validate();
                success: function(response) { 
                    var node = JSON.parse(response);
                    alert(node.status);
                }
            });
        }
    }); 


    // after "Edit item information" button is clicked, the corresponding form 
    // appears on the right
    $("#edit_item_info_but").click(function() {
        $.ajax({
            url: "/admin?username="+adminUser,
            type: "GET",
            success: function(response) {
                // 'edit item info' button is pressed down
                if (edit_item_but == false) {
                    // release the other buttons and hide unnecessary elements
                    add_user_but = false;
                    show_users_but = false;
                    add_item_but = false;
                    show_items_but = false;
                    delete_user_but = false;
                    delete_item_but = false;
                    edit_user_but = false;
                    $("#add_user_display").hide();
                    $("#show_users_display").hide();
                    $("#add_item_display").hide();
                    $("#show_items_display").hide();
                    $("#delete_user_display").hide();
                    $("#delete_item_display").hide();
                    $("#edit_user_option").hide();

                    // display the form
                    $("#edit_item_option").show();
                    edit_item_but = true;
                } else { // 'edit item info' button is released
                    // hide the form
                    edit_item_but = false;
                    $("#edit_item_option").hide();
                }
            }
        });
    });


    // Edit the item's info after "edit" is pressed
    $("#edit_item_but").click(function(e) {
        e.preventDefault();
        var item = $("#item_id").val().trim();
        var new_item_name = $("#new_item_name").val().trim();
        var new_price = $("#new_price").val().trim();
        var new_size = $("#new_size").val();
        var new_tag = $("#new_tag").val();
        var new_description = $("#new_description").val().trim();

        // ensure the ID of the item whose content needs modification is 
        // entered 
        if (item == '') {
            alert("Enter the ID of the item that needs modification.");
        } else {
            $.ajax({
                url: '/admin?itemID=' + item + '&name=' + new_item_name + 
                     '&price=' + new_price + '&size=' + new_size + 
                     '&tag=' + new_tag + '&description=' + new_description,
                type: "POST",
                success: function(response) { 
                    alert(response);
                }
            });
        }
    });


    // after "show all items" button is clicked, the name of all items  
    // appear on the right
    $("#display_items_but").click(function() {
        $.ajax({
            url: "/admin/allItems?username="+adminUser,
            type: "GET",
            success: function(response) {
                // 'show all item' button is pressed down
                if (show_items_but == false) {
                    // release the other buttons and hide unnecessary elements
                    add_user_but = false;
                    $("#add_user_display").hide();
                    edit_user_but = false;
                    $("#edit_user_option").hide();
                    $("#show_users_display").hide();
                    show_users_but = false;
                    add_item_but = false;
                    $("#add_item_display").hide();
                    delete_user_but = false;
                    $("#delete_user_display").hide();
                    delete_item_but = false;
                    $("#delete_item_display").hide();
                    edit_item_but = false;
                    $("#edit_item_option").hide();

                    // display the form
                    $("#show_items_display").show();
                    displayAllItems(response);
                    show_items_but = true;
                } else { // 'show all items' button is released
                    // hide the form
                    show_items_but = false;
                    $("#show_items_display").hide();
                }

            }
        });
    });

    // after "Delete Item" button is clicked, the corresponding text field 
    // appears on the right
    $("#delete_item_but").click(function() {
        $.ajax({
            url: "/admin?username="+ adminUser,
            type: "GET",
            success: function(response) {
                // 'delete user' button is pressed down
                if (delete_item_but == false) {
                    // release the other buttons and hide unnecessary elements
                    $("#edit_user_option").hide();
                    $("#show_users_display").hide();
                    $("#add_user_display").hide();
                    $("#show_items_display").hide();
                    $("#add_item_display").hide();
                    $("#delete_user_display").hide();
                    $("#edit_item_option").hide();
                    add_item_but = false;
                    edit_user_but = false;
                    show_users_but = false;
                    add_user_but = false;
                    show_items_but = false;
                    delete_user_but = false;
                    edit_item_but = false;

                    // display the form
                    $("#delete_item_display").show();
                    delete_item_but = true;
                } else { // 'delete user' button is released
                    // hide the form
                    delete_item_but = false;
                    $("#delete_item_display").hide();
                }
            }
        });
    });


    // after "Delete" button is clicked, item needs to be deleted
    $("#delete_item_submit").click(function(e) {
        e.preventDefault();
        var item = $("#delete_item").val().trim();

        if (item == '') {
            alert("Enter the ID of the item to be deleted.");
        } else {
            $.ajax({
                url: '/admin',
                type: "POST",
                data: {'deleteItem': item},
                success: function(response) {
                    alert(response);
                }
            });
        }
    });

    

//----------------------------HELPER FUNCTIONS---------------------------------

    // Display the info of all users (including the admins)
    function displayAllUsers(dataArray) {
        let parent = $('#users_table');
        parent.empty();

        // add the heading for each column 
        parent.append('<tr><th>ID</th><th>Username</th><th>Email</th>' +
                      '<th>Phone</th></tr>');

        // print out each username and their corresponding ids
        for (let i = 0; i < dataArray.length; i++) {
            parent.append('<tr><td>' + dataArray[i].id + '</td><td>' + 
                          dataArray[i].username + '</td><td>' + 
                          dataArray[i].email + '</td><td>' + dataArray[i].phone
                          + '</td></tr>');
        }
    }


    // Display the info of all items 
    function displayAllItems(dataArray) {
        let parent = $('#items_table');
        parent.empty();

        // add the heading for each column 
        parent.append('<tr><th>ID</th><th>Item</th><th>Price</th>' +
                      '<th>Size</th><th>Tag</th><th>Seller ID</th></tr>');

        // print out each username and their corresponding ids
        for (let i = 0; i < dataArray.length; i++) {
            parent.append('<tr><td>' + dataArray[i].id + '</td><td>' + 
                          dataArray[i].name + '</td><td>' + 
                          dataArray[i].price + '</td><td>' + dataArray[i].size
                          + '</td><td>' + dataArray[i].tag + '</td><td>' +
                          dataArray[i].seller + '</td></tr>');
        }
    }
});