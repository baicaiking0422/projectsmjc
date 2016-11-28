DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS goods;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_admin INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS goods;
CREATE TABLE goods (
  id INTEGER PRIMARY KEY,
  user_id INT,
  name TEXT,
  price INT NOT NULL,
  size VARCHAR(10) NOT NULL CHECK (size in ('XS','S','M','L','XL')),
  tag VARCHAR(2) NOT NULL CHECK (tag in ('Top', 'Bottom', 'Dress', 'Other')),
  description TEXT,
  picture TEXT,
  comments TEXT,

  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, is_admin) VALUES ('xueqi', '$2a$10$CiNxJ.OtQc9/DKiRX79Z3OfglNcAhDC9GCxbxovOCA0JSkjxvV9eS', 1);
INSERT INTO users (username, password, is_admin) VALUES ('minhua', '$2a$10$Y5GmdCeDbjEOaShJ.sPWwe5rtYvAPgEzIgRZXP.oU.43UuYMeATlu', 1);
INSERT INTO users (username, password, is_admin) VALUES ('zhujun', '$2a$10$9u5ozAyJWkmZnJ4rSHhRlOXupPI144NP3px0uGboVAMH4oPQLvkmO', 1);
INSERT INTO users (username, password, is_admin) VALUES ('xinyan', '$2a$10$CiNxJ.OtQc9/DKiRX79Z3OfglNcAhDC9GCxbxovOCA0JSkjxvV9eS', 1);

INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('A', '40', 'Top', 'XS', 'item', 'ABC');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('B', '40', 'Bottom', 'S', 'item', 'DEF');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('C', '140', 'Dress', 'M', 'item', 'ABC');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('D', '140', 'Top', 'L', 'item','DEF');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('E', '240', 'Other', 'XL', 'item', 'GHI');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('F', '240', 'Dress', 'XS', 'item', 'ABC');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('G', '340', 'Top', 'S', 'item', 'GHI');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('H', '440', 'Bottom', 'M', 'item', 'DEF');
INSERT INTO goods (name, price, tag, size, picture, description) VALUES ('I', '540', 'Other', 'XL', 'item', 'ABCDEF');
