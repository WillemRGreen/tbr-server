## Your TBR server
The server side of this app is built on node.js, using express, morgan, cors, and helmet for the endpoints. The database is postgresql.

## seed db command
psql -d tbr_pile -f ./seeds/seed.tbr_db.sql

## summary
This is the server side code for my TBR web application. It accomplishes several things for the purpose of the app. It has SQL scripts which create tables in the postgresQL database, and it seeds the database with dummy data. This server uses express with a service object/router model, utlizing this technology to tidily and efficiently create endpoints to call from client side. 

## the users/auth endpoint
the users and auth endpoints work together to handle registration, validation, and storage of users for the application. The middleware/auth handles most of the JWT technology, making sure that all the protected endpoints are protected properly, while the users endpoint handles the actual requests from the client. The users endpoint expects a username, password, and full name that acts as a nickname. It passes the request through several functions from the UsersService object which validates that the username isn't taken, and that all inputs are valid. If any of these criteria are not fitting, it returns the appropriate error. If the request makes it through the validation, then it hashes the password, inserts the user into the database, serializes the values, and returns the finished user to the client. The auth router also handles every login request, expecting a user name and password, verifying those using functions in the service object, and returning a JWT on  successful match

## the folders endpoint
the folders endpoint handles the folders that, on the client side, contain the books that the user saves. They are created by the user, and take in a name only. The other values are generated in the server, inserted into the database and return after serialization. The folders endpoint also handles a request for retrieving one specific folder by its id, which is used for displaying only the books for that folder on the client side

## the books endpoint
the books endpoint handles the books which are client created, and represent the main piece of data on the site. They take in a name, folder_id, description, and completed value. It generates an id for the book, and takes the user id from the request. It then inserts to the database, serializes and returns. The GET endpoint returns all books that have a user id that matches the user is from the request, so this is also using the auth section to be a protected endpoint. This endpoint also supports deletion, patching, and requesting with a specific book id in the request. 