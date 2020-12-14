## Your TBR server
The server side of this app is built on node.js, using express, morgan, cors, and helmet for the endpoints. The database is postgresql.

## seed db command
psql -d tbr_pile -f ./seeds/seed.tbr_db.sql