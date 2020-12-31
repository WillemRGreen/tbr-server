
## seed db command
psql -d tbr_pile -f ./seeds/seed.tbr_db.sql

## Your TBR
This is the server side code for my TBR web application. It accomplishes several things for the purpose of the app. It has SQL scripts which create tables in the postgresQL database, and it seeds the database with dummy data. This server uses express with a service object/router model, utlizing this technology to tidily and efficiently create endpoints to call from client side. 

## Overview

.
├── Procfile
├── README.md
├── migrations
│   ├── 001.do.create_tbr_folders.sql
│   ├── 001.undo.create_tbr_folders.sql
│   ├── 002.do.create_tbr_users.sql
│   ├── 002.undo.create_tbr_users.sql
│   ├── 003.do.create_tbr_books.sql
│   └── 003.undo.create_tbr_books.sql
├── package-lock.json
├── package.json
├── postgrator-config.js
├── seeds
│   ├── seed.tbr_db.sql
│   └── trunc.tbr_db.sql
├── src
│   ├── app.js
│   ├── auth
│   │   ├── auth-router.js
│   │   └── auth-service.js
│   ├── books
│   │   ├── books-router.js
│   │   └── books-service.js
│   ├── config.js
│   ├── folders
│   │   ├── folders-router.js
│   │   └── folders-service.js
│   ├── middleware
│   │   ├── basic-auth.js
│   │   └── jwt-auth.js
│   ├── server.js
│   └── users
│       ├── users-router.js
│       └── users-service.js
└── test
    ├── auth-endpoint.test.js
    ├── books-endpoint.test.js
    ├── folders-endpoint.test.js
    ├── setup.js
    ├── test-helpers.js
    └── users-endpoint.test.js

## Schema

# User

{
    id: 
        type: integer,
        required: true,
        unique: true
    user_name: 
        type: String,
        required: true,
        unique: true
    full_name: 
        type: String,
        required: true,
    password: 
        type: String,
        required: true,
    date_created:
        type: dte,
        default: new Date,
    date_modified: 
        type: date,
        default: new Date,
}

# folder

{
    name:
        type: String
        required: true
    id:
        type: integer
        required: true
        unique: true
    user_id:
        type: integer
        required: true
}

# book

{
    name:
        type: String
        required: true
    id:
        type: integer
        required: true
        unique: true
    user_id:
        type: integer
        required: true
    folder_id:
        type: integer
        required: true
    description:
        type: String
        required: true
    completed:
        type: boolean
        required: true
        default: false
    modified:
        type: date
        default: new Date
}

## the users endpoint

# Post /api/users
//req.body
{
  user_name: String,
  password: String,
  full_name: String
}
//res
{
  id: userId,
  user_name: String,
  full_name: String,
  password: String,
  date_created: date,
  date_modified: date
}

## the auth endpoint

# Post /api/auth/login
//req.body
{ user_name: String, password: String }

//res.body
authToken: JWT

## the folders endpoint

# GET /api/folders
//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}

//  Authorization
{ Authorization: Bearer ${token}}

//res
[
    {
        id: folderId
        name: String
        user_id: userId
    }
]

# POST /api/folders
    
//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}
//  Authorization
{ Authorization: Bearer ${token}}

//req.body
{
    name: String
}

//res
status: 201
[
    {
        id: folderId
        name: String
        user_id: userId
    }
]

# GET /api/folders/:folderId

//req.params:
{
    folder_id: folderId
}

//res
[
    {
        id: folderId
        name: String
        user_id: userId
    }
]

## the books endpoint

# GET /api/books
//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}

//  Authorization
{ Authorization: Bearer ${token}}

//res
[
    {
        id: bookId
        name: String
        description: String
        folder_id: folderId
        user_id: userId
        completed: BOOLEAN
    }
]

# POST /api/books
//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.body
{ 
    name: String, 
    folder_id: folderId, 
    description: String, 
    completed: BOOLEAN 
}

# GET /api/books/:bookId

//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.params:
book_id: bookId

# DELETE /api/books/:bookId
//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.params:
book_id: bookId

//res.status
:204

# PATCH /api/books/:bookId

//req.user
{
  id: userId,
  user_name: String,
  full_name: String,
  password: Srting,
  date_created: date,
  date_modified: date
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.params:
book_id: bookId

//res.status
:204

//req.body
{ 
    name: String, 
    folder_id: folderId, 
    description: String, 
    completed: BOOLEAN 
}

## technology stack

Node - Run-time environment
Express - Web application framework
PostgresQL - Database
JWT - Authentication
Mocha - Testing
Chai - Testing

## Author
Willem Green- Full Stack