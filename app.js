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

/**
 * Helper function for interacting with database.
 */
function create_user(username, password, password_confirmation, email_address, phone, callback) {
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
      db.run('INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)', [username, pw_hash, email_address, phone], function(err) {
        callback(err, username);
      });
    });
  }
}



var app = express();
nunjucks.configure('views', { autoescape: true, express: app });

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(session({ secret: 'I am actually a potato', resave: false, saveUninitialized: false }));

app.listen(port, function () {
  console.log('Shopping app listening on port ' + port + '!');
});

// Expose session variables to views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.get('/', function (req, res) {
  res.render('index.html');
});


app.post('/signin', function(req, res) {
  var reqUsername = req.body.username;
  var reqPassword = req.body.password;

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
      res.redirect('/');
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

  create_user(username, password, password_confirmation, email_address, phone, function(err, username) {
    if (err) {
      res.render('signup.html', {error: err});
    } else {
      // This way subsequent requests will know the user is logged in.
      req.session.username = username;
      res.redirect('/');  
    }
  });
});

app.get('/items', function(req, res){
   //console.log(req.body);
   //åconsole.log(req.query);
    var re = [];
    // console.log(req.query.price);
    // console.log(req.query.size);
    var price = req.query.price;
    var size = req.query.size;
    var tag = req.query.tag;

    var sql;
  if (price == "all" && size == "all" && tag == "All"){
    sql = "SELECT name, id, picture FROM goods";
  }
  else if (price == "all" && tag == "All"){
    sql = "SELECT name, id, picture FROM goods WHERE size == '" + size + "'";
  }
  else if (size == "all" && tag == "All"){
    if (price == "Under $100"){
      sql = "SELECT name, id, picture FROM goods WHERE price <= 100";
    } else if (price == "$100 - $200"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 100 and price <= 200";
    } else if (price == "$200 - $300"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 200 and price <= 300";
    } else if (price == "$300 - $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 300 and price <= 400";
    } else if (price == "over $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 400";
    }
  } 
  else if (size == "all" && price == "all"){
     sql = "SELECT name, id, picture FROM goods WHERE tag == '" + tag + "'";
  } else if (tag == "All"){
    if (price == "Under $100"){
      sql = "SELECT name, id, picture FROM goods WHERE price <= 100 and size == '" + size + "'";
    } else if (price == "$100 - $200"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 100 and price <= 200 and size == '" + size + "'";
    } else if (price == "$200 - $300"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 200 and price <= 300 and size == '" + size + "'";
    } else if (price == "$300 - $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 300 and price <= 400 and size == '" + size + "'";
    } else if (price == "over $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 400 and size == '" + size + "'";
    }
  } else if (size == "all"){
    if (price == "Under $100"){
      sql = "SELECT name, id, picture FROM goods WHERE price <= 100 and tag = '" + tag + "'";
    } else if (price == "$100 - $200"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 100 and price <= 200 and tag = '" + tag + "'";
    } else if (price == "$200 - $300"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 200 and price <= 300 and tag = '" + tag + "'";
    } else if (price == "$300 - $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 300 and price <= 400 and tag = '" + tag + "'";
    } else if (price == "over $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 400 and tag = '" + tag + "'";
    }
  } else if (price == "all"){
    sql = "SELECT id, picture FROM goods WHERE tag == '" + tag + "' and size = '" + size +"'";
  }
  else{
    if (price == "Under $100"){
      sql = "SELECT name, id, picture FROM goods WHERE price <= 100 and size == '" + size + "' and tag = '" + tag + "'";
    } else if (price == "$100 - $200"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 100 and price <= 200 and size == '" + size + "' and tag = '" + tag + "'";
    } else if (price == "$200 - $300"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 200 and price <= 300 and size == '" + size + "' and tag = '" + tag + "'";
    } else if (price == "$300 - $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 300 and price <= 400 and size == '" + size + "' and tag = '" + tag + "'";
    } else if (price == "over $400"){
      sql = "SELECT name, id, picture FROM goods WHERE price > 400 and size == '" + size + "' and tag = '" + tag + "'";
    }
  }
    db.all(sql, function(err, rows) {
    if(err) {
      throw err;
    }
    if(!rows) {
      throw "this shouldn't happen";
    }
    let len = rows.length;
    for (let i = 0; i < len; i ++){
      let obj = {"name":"","id":"", "picture":""};
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
  //var result = {"items": re};
});

//=========Zhujun Wang===Start=========
//Get comments for particular seller
app.get('/comments',function(req,res){
  var user_id = req.query.id;
  db.all("SELECT goods.name, users.username, goods.comments, CAST((julianday(datetime('now')) - julianday(goods.timestamp))*24 AS integer) AS days_ago " + 
    "FROM users, goods WHERE users.id = goods.user_id AND users.id = ? AND goods.bought = 0 " + 
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
  console.log("post id:" + item_id);
  var rating = req.body.rating;
  console.log("rating: " + rating);
  var comment = req.body.comment.substring(0,128);
  console.log("comment: "+comment);
  
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
  var item_id = req.query.item_id;
  console.log(item_id);
  if (req.session.user_id !== undefined) {
    db.all('SELECT currency FROM users WHERE id = ?', [req.session.user_id],function(err,current){
      
      var value = current[0].currency;
      db.all('SELECT * FROM goods WHERE id = ?', [item_id], function(err,row,current){
      // already sold
        //var current = value;
        console.log("YuE: "+value);
        if (value == null || value < row[0].price) {
          res.send("Not Enough");
        }
        else {
          // not sold, update 1 to 0
          db.run('UPDATE goods SET bought = 0 WHERE id = ?', [item_id], function(err){
            if(err) {
              console.log(err);
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
    });
    
  } 
  // not login yet , please log in
  else {
    //res.redirect('/');
    res.send("Not Reg");
  }
});

app.get('/good', function(req, res) {
  var item_id = req.query.id;
  db.all("SELECT * FROM goods WHERE goods.id = ? ",[item_id],function(err,rows){
      if(err){
        throw err;
      }
      console.log(rows[0]);
      var row = rows[0];
      res.render('sellinggoods.html',{data: row});
  });
});
//=========Zhujun Wang===End====

