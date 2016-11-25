DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS goods;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS goods;
CREATE TABLE goods (
  id INTEGER PRIMARY KEY,
  user_id INT,
  name TEXT NOT NULL,
  price INT NOT NULL,
  tag VARCHAR(10) NOT NULL CHECK (tag in ('XS','S','M','L','XL')),
  size VARCHAR(2) NOT NULL CHECK (size in ('top', 'bottom', 'dress', 'other')),
  description TEXT,
  timestamp INTEGER NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, is_admin) VALUES ('xueqi', '$2a$10$CiNxJ.OtQc9/DKiRX79Z3OfglNcAhDC9GCxbxovOCA0JSkjxvV9eS', 1);
INSERT INTO users (username, password, is_admin) VALUES ('minhua', '$2a$10$Y5GmdCeDbjEOaShJ.sPWwe5rtYvAPgEzIgRZXP.oU.43UuYMeATlu', 1);
INSERT INTO users (username, password, is_admin) VALUES ('zhujun', '$2a$10$9u5ozAyJWkmZnJ4rSHhRlOXupPI144NP3px0uGboVAMH4oPQLvkmO', 1);
INSERT INTO users (username, password, is_admin) VALUES ('xinyan', '$2a$10$CiNxJ.OtQc9/DKiRX79Z3OfglNcAhDC9GCxbxovOCA0JSkjxvV9eS', 1);