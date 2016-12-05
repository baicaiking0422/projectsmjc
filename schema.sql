DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS goods;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  currency INT,
  is_admin INTEGER DEFAULT 0
);

CREATE TABLE messages (
  id INT PRIMARY KEY,
  sender INT,
  receiver INT,
  message TEXT,
  FOREIGN KEY(sender) REFERENCES users(id),
  FOREIGN KEY(receiver) REFERENCES users(id)
);

CREATE TABLE goods (
  id INTEGER PRIMARY KEY,
  user_id INT,
  buyer_id INT,
  name TEXT NOT NULL,
  price INT NOT NULL,
  size VARCHAR(10) NOT NULL CHECK (size in ('XS','S','M','L','XL')),
  tag VARCHAR(2) NOT NULL CHECK (tag in ('Top', 'Bottom', 'Dress', 'Other')),
  description TEXT,
  picture TEXT,
  comments TEXT,
  rate_if INT NOT NULL CHECK (rate_if in (0,1)),
  rate INT CHECK (rate >= 0 AND rate <=5),
  bought INT NOT NULL CHECK (bought in (0,1)),
  timestamp INTEGER NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(buyer_id) REFERENCES users(id)
);

INSERT INTO users (username, password, is_admin) VALUES ('xueqi', '$2a$10$CiNxJ.OtQc9/DKiRX79Z3OfglNcAhDC9GCxbxovOCA0JSkjxvV9eS', 1);
INSERT INTO users (username, password, is_admin) VALUES ('minhua', '$2a$10$Y5GmdCeDbjEOaShJ.sPWwe5rtYvAPgEzIgRZXP.oU.43UuYMeATlu', 1);
INSERT INTO users (username, password, is_admin) VALUES ('zhujun', '$2a$10$9u5ozAyJWkmZnJ4rSHhRlOXupPI144NP3px0uGboVAMH4oPQLvkmO', 1);
INSERT INTO users (username, password, is_admin) VALUES ('xinyan', '$2a$10$ntPYdF4onGjQkeXVNGlkE.1zhIkk882dmVoc4qjAmwM7AovEYI1PC', 1);

INSERT INTO users (id, username, password, currency, is_admin) VALUES (5, '1p','$2a$10$RW0wv3ZqL9SaRUFL7PvNvepJXFMMuenmXmLmK8vxqZGmWkKTolI9i', 400, 0);
INSERT INTO users (id, username, password, currency, is_admin) VALUES (6, '2p','$2a$10$zsD3aTLRYeM9593i4.DBB./zHTsMa0XvSzlZv/4T2r2cZHpW0twqK',20, 0);

INSERT INTO goods (id,user_id,name,price,tag,size, picture, rate_if,description,bought) VALUES (999,6,'Bomber',32,'Top','M','t5.png', 0,'A high-polish pin with a deck of cards graphic, as well as a longline silhouette, front zipper, front slant pockets, a quilted lining, long sleeves with one zippered utility pocket, and ribbed trim.',1);
INSERT INTO goods (id,user_id,name,price,tag,size, picture, rate_if,description,bought) VALUES (989,5,'Pink Cardigans',10,'Top','L','t4.png',1,'A knit cardigan featuring an open front, long sleeves, and a slight high-low hem.',1);
INSERT INTO goods (id,user_id,name,price,tag,size, picture, rate, rate_if,description,comments,bought) VALUES (979,5,'Vintage Jean',10,'Bottom','XL','b5.png',2, 1,'A vintage jean, low-washed.','Fit well.',0);
INSERT INTO goods (id,user_id,name,price,tag,size, picture, rate, rate_if,description,comments,bought) VALUES (969,5,'Overall',12,'Bottom','M','b3.png',3, 1,'Imported. Vintage overall','Love the material and color',0);
INSERT INTO goods (id,user_id,name,price,tag,size, picture, rate, rate_if,description,comments,bought) VALUES (959,6,'Navy legging',13,'Bottom','S','b4.png',5,1,'Imported. Navy color leggin. Fit well','A little bit tight.',0);
INSERT INTO goods (id,user_id,name,price,tag,size, picture, rate, rate_if,description,comments,bought) VALUES (949,6,'White-start slipper',25,'Other','S','o3.png',4,1,'white stars slipper','It is very cute and warm!',0);

INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (939,6,'High-rise jean', '22', 'Bottom', 'XS', 'b1.png', 0,'Mid-washed jean',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (929,6,'Black dress', '32', 'Dress', 'S', 'd1.png', 0,'A marled ribbed knit swing dress featuring a mock neckline and long sleeves.',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (919,5,'Grey Dress', '20', 'Dress', 'L', 'd2.png', 0,'A marled ribbed knit swing dress featuring a mock neckline and long sleeves.',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (909,6,'Sweatshirt', '20', 'Top', 'XS', 't1.png',0,' A French terry sweatshirt featuring short dolman sleeves, a chest pocket, raw-cut hem, side slits, and a round neckline.',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (899,5,'Mini backpack', '42', 'Other', 'M', 'o1.png', 0,'A structured mini backpack featuring a drawstring closure, a flap top with twin faux leather buckles and snap button closures, fabric adjustable straps, an interior zip pocket, two side-zip pockets, one center-front zip pocket, and high polish accents.',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (889,5,'Christmas slipper', '22', 'Other', 'XS', 'o2.png', 0,'Christmas slipper',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (879,6,'Knit Hoodie', '23', 'Top', 'S', 't2.png', 0,'An oversized knit hoodie featuring a fleece lining, drawstring hood, long sleeves, a kangaroo pocket, and ribbed trim.',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (869,6,'Cardigan in grey', '14', 'Top', 'M', 't3.png', 0,'A knit cardigan featuring an open front, long sleeves, and a slight high-low hem.',1);
INSERT INTO goods (id, user_id, name, price, tag, size, picture, rate_if, description,bought) VALUES (859,5,'Skirt', '52', 'Bottom', 'XL', 'b2.png', 0,'Brown Skirt',1);


INSERT INTO messages (sender, receiver, message) VALUES (5, 6, 'hello');
INSERT INTO messages (sender, receiver, message) VALUES (6, 5, 'hello, how is going?');
INSERT INTO messages (sender, receiver, message) VALUES (5, 6, 'Good.');
INSERT INTO messages (sender, receiver, message) VALUES (6, 5, 'I like your dress. Can you accept 5 lower?');
INSERT INTO messages (sender, receiver, message) VALUES (5, 6, 'This is the lowest price I can bear.');
INSERT INTO messages (sender, receiver, message) VALUES (6, 5, 'Ok.');
