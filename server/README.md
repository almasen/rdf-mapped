# Server

## Running locally
Start by running `npm install` and then `npm run prod/dev-start` in a terminal
### Setting up local database for testing
1.  Download and install [PostgreSQL Core Distribution](https://www.postgresql.org/download/) version 12.x
2.  Configure Postgres root user's password to match 'DB_PASS' in .env and default port to be 5432
3.  Add Postgres installation `/bin` directory to PATH
4.  Create local database for application using `createdb -U postgres rdfdatabase`
5.  Run database migrations using `npm run db-migrate up`
6.  (optional) Import test dataset form /resources directory
