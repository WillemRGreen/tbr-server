ALTER TABLE tbr_folders
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS tbr_users;
