BEGIN;

TRUNCATE
    tbr_books,
    tbr_folders,
    tbr_users
    RESTART IDENTITY CASCADE;

INSERT INTO tbr_users (user_name, full_name, password)
VALUES 
    ('testuser1', 'Test Case1', 'password'),
    ('testuser2', 'Test Case2', 'example'),
    ('testuser3', 'Test Case3', 'testingpassword');

INSERT INTO tbr_folders (name, user_id)
VALUES
    ('testfolder1', 1),
    ('testfolder2', 2),
    ('testfolder3', 3);

INSERT INTO tbr_books (name, folder_id, user_id, description)
VALUES
    ('test title 1', 1, 1, 'this is the first test description'),
    ('test title 2', 2, 2, 'this is the second test description'),
    ('test title 3', 3, 3, 'this is the third test description');

COMMIT;