CREATE TABLE tbr_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP
);

ALTER TABLE tbr_folders
  ADD COLUMN
    user_id INTEGER REFERENCES tbr_users(id)
    ON DELETE SET NULL;