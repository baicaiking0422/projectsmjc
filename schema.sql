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
INSERT INTO users (username, password, is_admin) VALUES ('xinyan', '$2a$10$CiNxJ.OtQc9/DKiRX79Z3OfglNcAhDC9GCxbxovOCA0JSkjxvV9eS', 1);

INSERT INTO users (id, username, password, is_admin) VALUES (5, '1p','$2a$10$RW0wv3ZqL9SaRUFL7PvNvepJXFMMuenmXmLmK8vxqZGmWkKTolI9i',0);
INSERT INTO users (id, username, password, is_admin) VALUES (6, '2p','$2a$10$zsD3aTLRYeM9593i4.DBB./zHTsMa0XvSzlZv/4T2r2cZHpW0twqK',0);

INSERT INTO goods (id,user_id,name,price,tag,size,description,bought) VALUES (999,5,'Banana',12,'Other','M','Imported',1);
INSERT INTO goods (id,user_id,name,price,tag,size,description,bought) VALUES (989,5,'Banana-2',10,'Top','XL','Imported',1);
INSERT INTO goods (id,user_id,name,price,tag,size,description,comments,bought) VALUES (979,6,'Banana-3',10,'Top','XL','Imported','Good Banana',0);
INSERT INTO goods (id,user_id,name,price,tag,size,description,comments,bought) VALUES (969,6,'Apple',10,'Top','XL','Imported','NICE apple',0);

INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('A', '40', 'Top', 'XS', 'item', 'ABC',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('B', '40', 'Bottom', 'S', 'item', 'DEF',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('C', '140', 'Dress', 'M', 'item', 'ABC',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('D', '140', 'Top', 'L', 'item','DEF',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('E', '240', 'Other', 'XL', 'item', 'GHI',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('F', '240', 'Dress', 'XS', 'item', 'ABC',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('G', '340', 'Top', 'S', 'item', 'GHI',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('H', '440', 'Bottom', 'M', 'item', 'DEF',1);
INSERT INTO goods (name, price, tag, size, picture, description,bought) VALUES ('I', '540', 'Other', 'XL', 'item', 'ABCDEF',1);
