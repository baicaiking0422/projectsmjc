var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session')
var port = process.env.PORT || 3000;

var db = new sqlite3.Database('db.sqlite');
db.serialize();


var app = express();
nunjucks.configure('views', { autoescape: true, express: app });

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(session({ secret: 'I am actually a potato', resave: false, saveUninitialized: false }));

app.listen(port, function () {
  console.log('Vintage app listening on port ' + port + '!');
});

// Expose session variables to views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.get('/', function (req, res) {
  res.render('index.html');
});


//=========Xueqi Fan===Start=========

/**
 * Helper function for interacting with database.
 */
function create_user(username, password, password_confirmation, email_address, phone, money, callback) {
  if(password !== password_confirmation) {
    callback('Password does not match confirmation');
  } else {
    db.all('SELECT username FROM users WHERE username = ?', [username], function(err, rows) {
      if(rows.length > 0) {
        callback('User already exists');
        return;
      }

      // Hash the password using a salt, hashSync(data, salt).
      // More info: https://www.npmjs.com/package/bcrypt-nodejs
      var pw_hash = bcrypt.hashSync(password, 10);

      // Notice the database stores all passwords hashed.
      db.run('INSERT INTO users (username, password, email, phone, currency) VALUES (?, ?, ?, ?,?)', [username, pw_hash, email_address, phone,money], function(err) {
        callback(err, username);
      });
    });
  }
}

app.post('/signin', function(req, res) {
  //console.log(req.session);
  var reqUsername = req.body.username;
  var reqPassword = req.body.password;
  var item_id = req.query.item_id;
  var good_id = req.query.good_id;
  //console.log(good_id);
  db.all("SELECT id, username, password, is_admin FROM users WHERE username = '" + reqUsername + "'", function(err, rows) {
    if(err) {
      throw err;
    }
    if(!rows || rows.length > 1) {
      throw "this shouldn't happen";
    }

    // Compare hashed data with, compareSync(data, encrypted).
    // More info: https://www.npmjs.com/package/bcrypt-nodejs
    if(rows.length === 1 && bcrypt.compareSync(reqPassword, rows[0].password)) {
      req.session.user_id = rows[0].id;
      req.session.username = rows[0].username;
      req.session.is_admin = rows[0].is_admin === 1;
      if (item_id != null){
          db.all("SELECT * FROM goods WHERE goods.id = ? ",[item_id],function(err,r){
          if(err){
            throw err;
          }
          var ro = r[0];
          res.render('sellinggoods.html',{data: ro});
        });
      }else if (good_id != null){
         db.all("SELECT * FROM goods WHERE goods.id = ? ",[good_id],function(err,r){
          if(err){
            throw err;
          }
          var ro = r[0];
          res.render('sellinggoods.html',{data: ro});
        });
      }else{
        res.redirect('/');
      }
    } else {
      res.render('index.html', { error: 'Invalid username or password' });
    }
  });
});

app.get('/signout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  // Don't permit already-logged-in users to signup again.
  if(req.session.username !== undefined) {
    res.redirect('/');
    return;
  }

  res.render('signup.html');
});

app.post('/signup', function(req, res) {
  // Don't permit already-logged-in users to signup again.
  if(req.session.username !== undefined) {
    res.redirect('/');
    return;
  }

  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;
  var email_address = req.body.email_address;
  var phone = req.body.phone;
  var money = req.body.currency;
  //console.log(money);

  //do not allow all space in usernam or password;
  var user = username.replace(/\s+/g, '');
  var pwd = password.replace(/\s+/g, '');
  if (user == '' || pwd == ''){
    res.render('signup.html', {error: 'Could not type all space in username or password'});
    return;
  }
  create_user(username, password, password_confirmation, email_address, phone, money, function(err, username) {
    if (err) {
      res.render('signup.html', {error: err});
    } else {
      // This way subsequent requests will know the user is logged in.
      req.session.username = username;
      res.redirect('/');  
    }
  });
});

function getSelectSQL(page, search, buyer_id, size, tag, price){
  //console.log(page);
   if (page != null || page != undefined){
      var pageNum = parseInt(page);
      var pageQuery = " LIMIT 9 OFFSET " + (pageNum - 1) * 9;
    } else{
      var pageQuery = '';
    }

    var sql;
    var basicQuery = "SELECT name, id, picture FROM goods WHERE (name LIKE '%" 
    + search + "%' or description LIKE '%" + search + "%') and bought == 1 and user_id!=" + buyer_id;
    var sizeQuery = " and size == '" + size + "'";
    var priceQuery = " and price ";
    var tagQuery = " and tag== '" + tag + "'";
    // console.log(price+size+tag);
    // console.log("search" + search);
   // + " and bought == 1"; in database not sale 
  if (price == "all" && size == "all" && tag == "All"){
    sql = basicQuery + pageQuery;
  }
  else if (price == "all" && tag == "All"){
    sql = basicQuery + sizeQuery + pageQuery;
  }
  else if (size == "all" && tag == "All"){
    if (price == "Under $10"){
     sql = basicQuery + priceQuery + "<= 10"+ pageQuery;
    } else if (price == "$11 - $20"){
      sql = basicQuery + priceQuery + "> 10 and price <= 20"+ pageQuery;
    } else if (price == "$21 - $30"){
      sql = basicQuery + priceQuery + "> 20 and price <= 30"+ pageQuery;
    } else if (price == "$31 - $40"){
      sql = basicQuery + priceQuery + "> 30 and price <= 40"+ pageQuery;
    } else if (price == "over $40"){
     sql = basicQuery + priceQuery + "> 40"+ pageQuery;
    }
  } 
  else if (size == "all" && price == "all"){
     sql = basicQuery + tagQuery+ pageQuery;
  } else if (tag == "All"){
    if (price == "Under $10"){
        sql = basicQuery + sizeQuery +priceQuery + "<= 10"+ pageQuery;
    } else if (price == "$11 - $20"){
      sql = basicQuery + sizeQuery +priceQuery +"> 10 and price <= 20"+ pageQuery;
    } else if (price == "$21 - $30"){
      sql = basicQuery + sizeQuery +priceQuery +"> 20 and price <= 30"+ pageQuery;
    } else if (price == "$31 - $40"){
      sql = basicQuery + sizeQuery +priceQuery +"> 30 and price <= 40"+ pageQuery;
    } else if (price == "over $40"){
      sql = basicQuery + sizeQuery +priceQuery +"> 40"+ pageQuery;
    }
  } else if (size == "all"){
    if (price == "Under $10"){
      sql = basicQuery + tagQuery +priceQuery + "<= 10"+ pageQuery;
    } else if (price == "$11 - $20"){
      sql = basicQuery + tagQuery +priceQuery +"> 10 and price <= 20"+ pageQuery;
    } else if (price == "$21 - $30"){
      sql = basicQuery + tagQuery +priceQuery +"> 20 and price <= 30"+ pageQuery;
    } else if (price == "$31 - $40"){
      sql = basicQuery + tagQuery +priceQuery +"> 30 and price <= 40"+ pageQuery;
    } else if (price == "over $40"){
      sql = basicQuery + tagQuery +priceQuery +"> 40"+ pageQuery;
    }
  } else if (price == "all"){
    sql = basicQuery + tagQuery +sizeQuery+ pageQuery;
  }
  else{
    if (price == "Under $10"){
      sql = basicQuery + tagQuery +sizeQuery+ "<= 10"+ pageQuery;
    } else if (price == "$11 - $20"){
      sql = basicQuery + tagQuery +sizeQuery+"> 10 and price <= 20"+ pageQuery;
    } else if (price == "$21 - $30"){
      sql = basicQuery + tagQuery +sizeQuery+"> 20 and price <= 30"+ pageQuery;
    } else if (price == "$31 - $40"){
     sql = basicQuery + tagQuery +sizeQuery+"> 30 and price <= 40"+ pageQuery;
    } else if (price == "over $40"){
     sql = basicQuery + tagQuery +sizeQuery+"> 40"+ pageQuery;
    }
  }
  //console.log(sql+"!!!!!");
  return sql;

}

app.get('/items', function(req, res){
   //console.log(req.body);
   //åconsole.log(req.query);
    var re = [];
    // console.log(req.query.price);
    // console.log(req.query.size);
    var price = req.query.price;
    var size = req.query.size;
    var tag = req.query.tag;
    var search = req.query.search;
    var page = req.query.page;
    var buyer = req.query.buyer;
    if (buyer == ''){
      var buyer_id = -1;
      var sql = getSelectSQL(page, search, buyer_id, size, tag, price);
      //console.log(sql);
      db.all(sql, function(err, rows) {
      if(err) {
        throw err;
      }
      if(!rows) {
        throw "this shouldn't happen";
      }
      var len = rows.length;
      for (var i = 0; i < len; i ++){
        var obj = {"name":"","id":"", "picture":""};
        obj["name"] = rows[i].name;
        obj["id"] = rows[i].id;
        obj["picture"] = rows[i].picture;
        re[i] = obj;
        //console.log("id " + rows[i].id + " picture " + rows[i].picture);
      // console.log(re[i]);
      }
      //console.log(re);
      res.send(JSON.stringify(re));
    });

    }else{
        db.all("SELECT * FROM users WHERE username==?", [buyer], function (err, rows) {
            if (err) {
              throw err;
            }
            if(!rows) {
               var  buyer_id = -1;
            }else{
              var buyer_id = rows[0].id;
              var sql = getSelectSQL(page, search, buyer_id, size, tag, price);
      db.all(sql, function(err, rows) {
      if(err) {
        throw err;
      }
      if(!rows) {
        throw "this shouldn't happen";
      }
      var len = rows.length;
      for (var i = 0; i < len; i ++){
        var obj = {"name":"","id":"", "picture":""};
        obj["name"] = rows[i].name;
        obj["id"] = rows[i].id;
        obj["picture"] = rows[i].picture;
        re[i] = obj;
        //console.log("id " + rows[i].id + " picture " + rows[i].picture);
      // console.log(re[i]);
      }
      //console.log(re);
      res.send(JSON.stringify(re));
    });


            }
      });
    }
});

app.get("/addingGoods", function(req, res){
  req.session.username = req.query.username;
  res.render("addingGoods.html");

});

app.post("/addingGoods", function(req, res){
  //console.log(req.body);
  var username = req.query.username;
  var name = req.body.itemname;
  var price = req.body.price;
  var size = req.body.itemsize;
  var tag = req.body.itemtag;
  var description = req.body.description;
  //console.log(money);

  create_item(username, name, price, size, tag, description, function(err){
    if (err){
      req.session.username = username;
      res.render('addingGoods.html', {error:err});
    } else{
      var wanteduser = {};
      wanteduser["username"] = username;
      req.session.username = username;
      res.render('success.html', {data: wanteduser});
    }
  })
});

function create_item(username, itemname, price, size, tag, description, callback) {
  db.all('SELECT id FROM users WHERE username = ?', [username] ,function(err, rows){
    if (rows.length == 0 || rows.length > 1){
      callback('User does not exists!');
      return;
    }
    var userid = rows[0].id;

    db.run('INSERT INTO goods (user_id, name, price, size, tag, description, rate_if, bought) VALUES (?,?,?,?,?,?,?,?)', 
      [userid, itemname, price, size, tag, description, 0, 1], function(err){
        callback(err);
      });

  });
}

app.get("/wallet", function(req, res){
  var user = req.query.username;
  db.all("SELECT currency FROM users WHERE username==?", [user], function (err, rows) {
    if (err) {
      throw err;
    }
  if(!rows) {
      throw "this shouldn't happen";
    }
    var obj = {"currency" : rows[0].currency};
    res.send(JSON.stringify(obj));
  });
});

app.post("/wallet", function(req, res){
  //console.log(req.query);
  var user = req.query.username;
  var charging = req.body.charging;
  var amount = parseInt(charging);
  db.all("SELECT currency FROM users WHERE username=?", [user], function(err, rows){
    if (err) {
      throw err;
    } 
    if(!rows) {
      throw "this shouldn't happen";
    } 
    var temp = parseInt(rows[0].currency);
    var newAmount = rows[0].currency + amount;
    //console.log("new amount is " + newAmount);
    db.run("UPDATE users SET currency = ?", [newAmount], function(err2){
      if (err2){
        throw err2;
      } else{
        var wanteduser = {};
        wanteduser["username"] = user;
        req.session.username = user;
        res.render('success.html', {data: wanteduser});
      }
    })
  })
});

app.get("/message", function(req, res){
  var receiver = req.query.username;
  var re = [];
  db.all("SELECT u1.username as senderName, message FROM users u1, users u2, messages" + 
    " WHERE u1.id==messages.sender and u2.id==messages.receiver and u2.username==?", [receiver], function (err, rows) {
    if (err) {
      throw err;
    }
  if(!rows) {
      throw "this shouldn't happen";
    }
    //console.log(rows);
    var len = rows.length;
    for (var i = 0; i < len; i ++){
      var obj = {"name":"","message":""};
      obj["name"] = rows[i].senderName;
      obj["message"] = rows[i].message;
      re[i] = obj;
      //console.log("id " + rows[i].id + " picture " + rows[i].picture);
     // console.log(re[i]);
    }
     //console.log(re);
    res.send(JSON.stringify(re));
  });

})

function updatePassword(username, pwd, pwd_con, callback){
  if (pwd != pwd_con){
    callback('Password does not match confirmation');
  }else{
    var pw_hash = bcrypt.hashSync(pwd, 10);
    db.run("UPDATE users SET password = ? WHERE username=?", [pw_hash, username], function(err){
        callback(err, username);
    });
  }
}

function updateEmail(username, email, callback){
  db.run("UPDATE users SET email = ? WHERE username=?", [email, username], function(err){
        callback(err, username);
    });
}

function updatePhone(username, phone, callback){
  db.run("UPDATE users SET phone = ? WHERE username=?", [phone, username], function(err){
        callback(err, username);
    });
}

app.post('/editinfo', function(req, res){
  var reqUsername = req.query.username;
  var reqPassword = req.body.pw;
  var reqPwCon = req.body.pw_conf;
  var reqEmail = req.body.email;
  var reqPhone = req.body.phone;

  if (reqPassword != null){
    updatePassword(reqUsername, reqPassword, reqPwCon, function(err, username){
      if (err){
        res.render('userinfo.html', {error:err});
      }else{
        var wanteduser = {};
            wanteduser["username"] = reqUsername;
            req.session.username = reqUsername;
            res.render('success.html', {data: wanteduser});
      }
    })
  } else if (reqEmail != null){
    updateEmail(reqUsername, reqEmail, function(err, username){
      if (err){
        res.render('userinfo.html', {error:err});
      }else{
        var wanteduser = {};
            wanteduser["username"] = reqUsername;
            req.session.username = reqUsername;
            res.render('success.html', {data: wanteduser});
      }
    });
  } else if (reqPhone != null){
      updatePhone(reqUsername, reqPhone, function(err, username){
         if (err){
            res.render('userinfo.html', {error:err});
          }else{
            var wanteduser = {};
            wanteduser["username"] = reqUsername;
            req.session.username = reqUsername;
            res.render('success.html', {data: wanteduser});
          }
      });
    }
})

app.get('/sendmessage', function(req, res){
  var sender = req.query.sender;
  var item_id = req.query.item_id;
  //console.log("sender id " + sender);
  if (sender == ''){
     res.send("Not Reg");
  }else{
  db.all("SELECT user_id FROM goods WHERE id = ? ", [item_id], function (err, rows) {
    if (err) {
      throw err;
    }

    var re = {};
    re["receiver"] = rows[0].user_id;
    res.send(JSON.stringify(re));
    //res.jsonp(wanteduser);
  });
}
})

app.get('/send', function(req, res){
  var receiver = req.query.receiver;
  var reName = req.query.receiverName;
  //console.log(reName);
  if (reName == null || reName == undefined){
  db.all("SELECT username FROM users WHERE id = ? ", [receiver], function (err, rows) {
    if (err) {
      throw err;
    }
    if (!rows){
      throw "no valid message receiver";
    }

    var re = {};
    re["receiver"] = rows[0].username;
    res.render('message.html', {data: re});
  });}
  else{
    var re = {};
    //console.log("get username", reName);
    re["receiver"] = reName;
    res.render('message.html', {data: re});
  }
})

app.post('/send', function(req, res){
  var sender = req.body.sender;
  var receiver = req.body.receiver;
  var msg = req.body.message;
  //console.log("in post send " + sender + receiver + msg);
  db.all("SELECT u1.id as senderID, u2.id as receiverID FROM users u1, users u2 WHERE u1.username=? and u2.username=?", [sender, receiver], function(err,rows){
    if (err){
      throw err;
    }
    var sId = rows[0].senderID;
    var rId = rows[0].receiverID;
    db.run('INSERT INTO messages (sender, receiver, message) VALUES (?,?,?)', [sId,rId, msg], function(err2){
       if (err2){
          throw err2;
        }
        res.send('Success');
      });
  });
})

//=========Xueqi Fan===End====

//=========Minhua Zhu===Start=========
// usr info
app.get('/userinfo', function(req, res) {
  var reqUsername = req.query.username;
 // console.log("here"+reqUsername);

  db.all("SELECT id, username, password, email, phone FROM users WHERE username = ? ", [reqUsername], function (err, rows) {
    if (err) {
      throw err;
    }

    var wanteduser = {};
    wanteduser["username"] = rows[0].username;
    wanteduser["password"] = rows[0].password;
    wanteduser["email"] = rows[0].email;
    wanteduser["phone"] = rows[0].phone;
    //console.log(wanteduser);
    //console.log({data: wanteduser});
    res.render('userinfo.html', {data: wanteduser});
    //res.jsonp(wanteduser);
  });
});

app.get('/sold', function(req, res) {
  var reqUsername = req.query.username;
 // console.log("for sold");

  db.all("SELECT name, price, size FROM goods,users WHERE user_id = users.id and username = ? ", [reqUsername], function (err, rows) {
    if (err) {
      throw err;
    }

    var soldlist = {};
    soldlist["goods"] = new Array();
    //soldlist.["goods"].push(reqUsername);
    for(var i=0; i<rows.length; i++) {
        var single = new Object();
        single.name = rows[i].name;
        single.price = rows[i].price;
        single.size = rows[i].size;
        soldlist["goods"].push(single);

    }
    //console.log(soldlist);
    res.json(soldlist);
  });
});

app.get('/purchase', function(req, res) {
  var reqUsername = req.query.username;
  //console.log("for purchase");
  //console.log(reqUsername);

  db.all("SELECT name, price, size FROM goods,users WHERE buyer_id = users.id and username = ? ", [reqUsername], function (err, rows) {
    if (err) {
      throw err;
    }

    var purchaselist = {};
    purchaselist["goods"] = new Array();
    //soldlist.["goods"].push(reqUsername);
    for(var i=0; i<rows.length; i++) {
        var single = new Object();
        single.name = rows[i].name;
        single.price = rows[i].price;
        single.size = rows[i].size;
        purchaselist["goods"].push(single);

    }
    //console.log(purchaselist);
    res.json(purchaselist);
  });
});

app.get('/rate', function(req, res) {
  var reqUsername = req.query.username;
  //console.log("for rate");
  //console.log(reqUsername);

  db.all("SELECT goods.id, name, price, size FROM goods,users WHERE buyer_id = users.id and rate_if = 0 and username = ? ", [reqUsername], function (err, rows) {
    if (err) {
      throw err;
    }

    var ratelist = {};
    ratelist["goods"] = new Array();
    //soldlist.["goods"].push(reqUsername);
    for(var i=0; i<rows.length; i++) {
        var single = new Object();
        single.id = rows[i].id;
        single.name = rows[i].name;
        single.price = rows[i].price;
        single.size = rows[i].size;
        ratelist["goods"].push(single);

    }
   // console.log(ratelist);
    res.json(ratelist);
  });
});


//=========Minhua Zhu===End====

//=========Zhujun Wang===Start=========
//Get comments for particular seller
app.get('/comments',function(req,res){
  var user_id = req.query.id;
  db.all("SELECT goods.name, goods.rate, users.username, goods.comments, CAST((julianday(datetime('now')) - julianday(goods.timestamp))*24 AS integer) AS days_ago " + 
    "FROM users, goods WHERE goods.rate_if = 1 AND users.id = goods.user_id AND users.id = ? AND goods.bought = 0 " + 
    "ORDER BY goods.timestamp DESC LIMIT 10",[user_id], function(err,rows){
      if(err){
        throw err;
      }
      res.json(rows);
  });
});



//Add comment for each item
app.post('/comments',function(req,res){
  var item_id = req.query.id;
  //console.log("post id:" + item_id);
  var rating = req.body.rating;
  //console.log("rating: " + rating);
  var comment = req.body.comment.substring(0,128);
  //console.log("comment: "+comment);
  
  var query = 'UPDATE  goods SET comments = ?, rate = ?, rate_if = 1 WHERE id = ?';
  var placeholders = [comment, rating, item_id];

  db.run(query, placeholders, function(err) {
        if(err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          //res.sendStatus(200);
          res.redirect('/');
        }
    }); 
});

// update item info
app.post('/buy',function(req,res){
  //not login cannot buy
  //console.log("buy!!" + req.session.user_id);
  var item_id = req.query.item_id;
  console.log(item_id);
  if (req.session.username !== undefined) {
    db.all('SELECT id, currency FROM users WHERE username = ?', [req.session.username],function(err,current){
      
      var value = current[0].currency;
      var user_id = current[0].id;
      db.all('SELECT * FROM goods WHERE id = ?', [item_id], function(err,row,current){
      // already sold
        //var current = value;
       // console.log("YuE: "+value);
        if (value == null || value < row[0].price) {
          res.send("Not Enough");
        }
        else {
          // not sold, update 1 to 0
          var rest = value - row[0].price;
          db.run ('UPDATE users SET currency = ? WHERE username = ?', [rest, req.session.username], function(err){
          	if (err) {
          		res.sendStatus(500);
          	} 

          	else {
          		db.run('UPDATE goods SET buyer_id = ?, bought = 0 WHERE id = ?', [user_id, item_id], function(err){
		            if(err) {
		              //console.log(err);
		              res.sendStatus(500);
		            }
		            else {
		              var re = {};
		              re["current"] = req.session.username;
		              res.send(JSON.stringify(re));
		            }
          		});
          	}
          });
        }
      });
    });
    
  } 
  // not login yet , please log in
  else {
    //res.redirect('/');
    console.log("Not Reg");
    res.send("Not Reg");
  }
});
app.get('/good', function(req, res) {
  var item_id = req.query.id;
  db.all("SELECT * FROM goods WHERE goods.id = ? ",[item_id],function(err,rows){
      if(err){
        throw err;
      }
     // console.log(rows[0]);
      var row = rows[0];
      res.render('sellinggoods.html',{data: row});
  });
});

app.get('/feedback', function(req, res) {
  var item_id = req.query.item_id;
  //console.log("in get feedback" + item_id);
  db.all("SELECT * FROM goods WHERE goods.id = ? ",[item_id],function(err,rows){
      if(err){
        throw err;
      }
      //console.log(rows[0]);
      var row = rows[0];
      res.render('feedback.html',{data: row});
  });
});
//=========Zhujun Wang===End====

//=========Xinyan Jiang===Start================================================

// admin home page
app.get('/admin', function(req, res) {
  var reqUsername = req.query.username;
  if (reqUsername !== undefined){
   db.all('SELECT * FROM users WHERE username = ?', [reqUsername], function(err, rows){
    if (rows[0].is_admin == 1){
      res.render('admin.html');
    }else{
      res.redirect('/');
    }
  });}else{
    res.redirect('/');
   } 
});


app.post('/admin', function(req, res){
  if (req.query.user) { // edit user information is selected
    var user = req.query.user; 
    var username = req.query.username;
    var password = req.query.password;
    var email = req.query.email;
    var phone = req.query.phone;
    var username_needs_change = false;

    // find if user with username "user" exists
    db.all('SELECT * FROM users WHERE username = ?', [user], 
           function(err, rows) {
      if (err) {
        throw err;
      }

      if (!rows || rows.length > 1) {
        throw "this shouldn't happen";
      }

      if (rows.length == 0) { // no user is found with username "user"
        res.send("No such user exists.");
      } else if (rows.length == 1) { // user exists
        var id = rows[0].id; // find the unique id of the user 

        // Check which attribute in users needs to be modified. If any field
        // does not need to be changed, replace the field with the old content
        if (password == undefined || password == '') {
          // password doesn't need to be changed 
          password = rows[0].password;
        }

        if (email == undefined || email == '') { // email is not changed
          email = rows[0].email;
        } 

        if (phone == undefined || phone == '') { // phone number is not changed
          phone = rows[0].phone;
        }

        if (username == undefined || username == '') { // username unchanged
          username = user;
          username_needs_change = false;
        } else { // username needs to be changed
          username_needs_change = true;
        }

        // Check if the new username is already in use by someone else
        db.all('SELECT id FROM users WHERE username = ?', [username], 
               function(err2, rows2) {
          if (err2) {
            throw err2;
          }

          if (!rows2 || rows2.length > 1) {
            throw "this shouldn't happen";
          }

          if (rows2.length == 1 && username_needs_change) {
            res.send("This username is already in use. Try another name.");
          } else { // the username does not exist
            // update the user's info
            db.run('UPDATE users SET username = ?, password = ?, ' + 
                    'email = ?, phone = ? WHERE id = ?', 
                    [username, password, email, phone, id], 
                    function(err3, rows3) {
              if (err3) {
                throw err3;
              } else {
                res.send("Information is changed successfully");
              }
            });
          }
        });  
      } 
    });
  } else if (req.query.itemID) { // edit item information is selected
    var item = req.query.itemID;
    var name = req.query.name;
    var price = req.query.price;
    var size = req.query.size;
    var tag = req.query.tag;
    var description = req.query.description;

    // find if item with ID "item" exists
    db.all('SELECT * FROM goods WHERE id = ?', [item], function(err, rows) {
      if (err) {
        throw err;
      }

      if (!rows || rows.length > 1) {
        throw "this shouldn't happen";
      }

      if (rows.length == 0) { // no item is found with the given ID
        res.send("No such item exists.");
      } else if (rows.length == 1) { // item exists
        // Check which attribute in items needs to be modified. If any field
        // needs to be changed, replace the field with the new content
        if (name == null || name == "") { // item name doesn't need change
          name = rows[0].name;
        }

        if (price == null || price == "") { // price is not changed
          price = rows[0].price;
        } 

        if (size == '(No change)') { // size is not changed
          size = rows[0].size;
        }

        if (tag == '(No change)') { // tag is not changed
          tag = rows[0].tag;
        }

        if (description == null || description == "") {
          description = rows[0].description;
        }

        if (isNaN(price)) { // price is not a valid number
          res.send("Price is not a valid number.");
        } else { // update item info
          db.run('UPDATE goods SET name = ?, price = ?, ' + 
                  'size = ?, tag = ?, description = ? WHERE id = ?', 
                  [name, price, size, tag, description, item], 
                  function(err3, rows3) {
            if (err3) {
              throw err3;
            } else {
              res.send("Information is updated successfully");
            }
          });     
        }     
      } 
    });
  } else if (req.body.deleteUser) { // delete user is selected
    var username = req.body.deleteUser;

    // check if user with username exists
    db.all("SELECT id FROM users WHERE username = ?", [username], 
           function(err, rows) {
      if(err) {
        throw err;
      }
      if(!rows || rows.length > 1) {
        throw "this shouldn't happen";
      } 

      if (rows.length == 0) { // no user is found 
        res.send("No such user exists.");
      } else if (rows.length == 1) { // an user is found
        var id = rows[0].id; // find the unique id of the user 

        //delete the user
        db.run("DELETE FROM users WHERE username = ?", [username], 
               function(err2, rows) {
          if (err2) {
            throw err2;
          } else {
            res.send("User is deleted successfully");
            // delete all item the user the user is selling or sold
            db.run("DELETE FROM goods WHERE user_id = ?", [id], 
                   function(err3, rows) {
              if (err3) {
                throw err3;
              }
            });
          }
        });
      }
    });
  } else if (req.body.deleteItem) { // delete item is selected
    var itemID = req.body.deleteItem;

    // Find all attributes of item with id if possible
    db.all("SELECT * FROM goods WHERE id = ?", [itemID], function(err, rows) {
      if(err) {
        throw err;
      }

      if(!rows || rows.length > 1) {
        throw "this shouldn't happen";
      } 

      if (rows.length == 0) { // no item is found 
        res.send("No such item.");

      } else if (rows.length == 1) { // the item is found then delete the item

        db.run("DELETE FROM goods WHERE id = ?", [itemID], 
               function(err2, rows) {
          if (err2) {
            throw err2;
          } else {
            res.send("Item is deleted successfully");
          }
        });
      }
    });
  } else if (req.query.name) { // add item is selected
    var name = req.query.name;
    var price = req.query.price;
    var size = req.query.size;
    var tag = req.query.tag;
    var seller = req.query.seller;
    var description = req.query.description;
    // Check if all four fields are filled
    if (name == '' || price == '' || size == '' || tag == '') {

      re = {status: "All fields must be filled."};
      res.send(JSON.stringify(re));

    } else if (isNaN(price)) { // if price is not a valid number

      re = {status: "Price has to be a valid number."};
      res.send(JSON.stringify(re));

    } else {
      if (description == '') { 
        description = 'none';
      } 

      // create item 
      if (seller == '') { 
        // admin adds items, set default seller to be one of the admin
        seller = 'xueqi'; 
      } 

      // add item to database
      create_item(seller, name, price, size, tag, description, 
                  function(err, seller) {
        if (err) {
          res.send(JSON.stringify({status: err}));
        } else {
          re = {status:"Item added successfully!"};
          res.send(JSON.stringify(re));
        }
      });     
    }
  } else { // add user is selected
    var re;
    var username = req.query.username;
    var password = req.query.password;
    var email = req.query.email;
    var phone = req.query.phone;
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    var phone_regex = /\(?\d{3}\)?-?\d{3}-?\d{4}/;

    // Check if all four fields are filled correctly
    if (password.replace(/\s+/g, '') == '' || 
        username.replace(/\s+/g, '') == '') {

      re = {status: "Username and password must be filled."};
      res.send(JSON.stringify(re));

    } else if (email.replace(/\s+/g, '') != '' && 
               email.match(email_regex) == null) { // check validity of email

      re = {status: "Invalid format for email."};
      res.send(JSON.stringify(re));

    } else if (phone.replace(/\s+/g, '') != '' && 
               phone.match(phone_regex) == null) { // Check validity of phone

      re = {status: "Invalid format for phone number."};
      res.send(JSON.stringify(re));

    } else { // Check if user exists

      if (email == '') {
        email = " ";
      } 
      if (phone == '') {
        phone = " ";
      }
      var money = 0;
      // create the user
      create_user(username, password, password, email, phone, money, 
                  function(err, username) {

        if (err) {
          //res.render('signup.html', {error: err});
          res.send(JSON.stringify({status: err}));
        } else {
          re = {status:"User added successfully!"};
          res.send(JSON.stringify(re));
        }
      });
    }
  } 
});

// send all the user info to admin.jss
app.get('/admin/allUsers', function(req, res) {
  reqUsername = req.query.username;
  if (reqUsername !== undefined){
    db.all('SELECT * FROM users WHERE username = ?', [reqUsername], function(err, rows){
      if (rows[0].is_admin == 1){
  // get all attributes of all rows from users
  db.all("SELECT * FROM users", [],function(err, rows) {
    if(err) {
      throw err;
    }
    if(!rows) {
      throw "this shouldn't happen";
    } else {
      // contains all the users and their corresponding info
      var users = []; 

      // loop over each row
      for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id;
        var username = rows[i].username;
        var email = rows[i].email;
        var phone = rows[i].phone;

        if(rows[i].email == null) {
          email = '';
        }

        if (rows[i].phone == null) {
          phone = '';
        }

        var row = {"id" : id, "username" : username,
                   "email" : email, "phone" : phone};

        users.push(row); // append each row users
      } 
      res.send(users);    
    } 
  });}else{
    res.redirect('/');
  }});}else{
      res.redirect('/');
    }
});

// send all item info to admin.js
app.get('/admin/allItems', function(req, res) {
  reqUsername = req.query.username;
  if (reqUsername !== undefined){
    db.all('SELECT * FROM users WHERE username = ?', [reqUsername], function(err, rows){
      if (rows[0].is_admin == 1){
  // find all items and their respective info from goods table 
  db.all("SELECT * FROM goods", [],function(err, rows) {
    if(err) {
      throw err;
    }
    if(!rows) {
      throw "this shouldn't happen";
    } else {
      var items = []; // contains all the usernames and ids

      // loop over each row
      for (var i = 0; i < rows.length; i++) {
        var row = {"id" : rows[i].id, "name" : rows[i].name,
                   "price" : rows[i].price, "size" : rows[i].size,
                   "tag" : rows[i].tag, "seller" : rows[i].user_id};
        items.push(row);
      } 
      res.send(items);    
    } 
  });}else{
    res.redirect('/');
  }});}
    else{
      res.redirect('/');
    }
});

//=========Xinyan Jiang===End==================================================

