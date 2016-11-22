DROP TABLE IF EXISTS users;
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
  tag TEXT NOT NULL,
  size TEXT NOT NULL,
  description TEXT,
  timestamp INTEGER NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, is_admin) VALUES ('sherry', '$2a$10$0B0Yx3ScNr3.WdYiha41z.xDh4H2IuqT63QmAM5Nbh9NoAL8PKV4m', 1);
