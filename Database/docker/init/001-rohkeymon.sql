CREATE TABLE IF NOT EXISTS users (
  user_id char(36) NOT NULL DEFAULT (uuid()),
  username varchar(45) DEFAULT NULL,
  hashed_pw varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  email varchar(319) DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY users_username_unique (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS rohkeymon_decklists (
  decklist_id char(36) NOT NULL,
  card_id varchar(45) NOT NULL,
  card_copies int DEFAULT 1,
  PRIMARY KEY (decklist_id, card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO rohkeymon_decklists (decklist_id, card_id, card_copies)
VALUES ('44764e09-bf3d-11f0-a784-d8bbc1d9bfc1', 'base1-6', 2)
ON DUPLICATE KEY UPDATE card_copies = VALUES(card_copies);
